# config2ts 中文文档

将配置文件（csv、ini、toml）转换为 TypeScript 类型定义文件。

## 目录

- [快速开始](#快速开始)
- [安装](#安装)
- [命令行使用](#命令行使用)
- [支持的配置格式](#支持的配置格式)
- [CSV 字段类型](#csv-字段类型)
- [引用功能](#引用功能)
- [资源索引](#资源索引assets2ts)
- [示例](#示例)
- [常见问题](#常见问题)
- [注意事项](#注意事项)

## 快速开始

```bash
# 全局安装
npm install -g config2ts

# 转换当前目录下的配置文件
config2ts

# 指定目录和输出文件名
config2ts -d ./config -n config.ts
```

## 安装

```bash
# 全局安装
npm install -g config2ts

# 项目内安装
npm install config2ts --save-dev
```

## 命令行使用

```bash
config2ts [options]
```

### 选项

| 选项 | 简写 | 说明 | 默认值 |
| :--- | :--- | :--- | :---: |
| `--name <name>` | `-n` | 输出文件名 | `csv.ts` |
| `--dir <path>` | `-d` | 配置文件目录 | `.` |
| `--outDir <path>` | `-o` | 输出目录 | 与配置目录相同 |
| `--assets <path>` | `-a` | 资源目录，扫描生成 `assets.ts` 资源索引 | `public` |
| `--version` | `-V` | 输出版本号 | - |
| `--help` | `-h` | 显示帮助 | - |

### 使用示例

```bash
# 使用默认配置
config2ts

# 指定配置目录
config2ts -d ./config

# 指定输出目录
config2ts -d ./config -o ./dist

# 自定义输出文件名
config2ts -n myConfig.ts

# 完整示例
config2ts -d ./config -o ./src/types -n config.ts
```

## 支持的配置格式

### CSV

CSV 文件第一行是字段名，第二行是字段类型，从第三行开始是数据。

```csv
id,name,age
Index,String,Number
1,张三,25
2,李四,30
```

### INI

```ini
num = 1
str = string
bool = true

[ItemType]
book = 1
fruit = 2
```

### TOML

```toml
num = 1
str = "test"

[ItemType]
book = 1
fruit = 2
```

## CSV 字段类型

| 类型 | TypeScript 类型 | 说明 |
| :--- | :--- | :--- |
| `Index` | `string` | 索引字段，用于生成 Map |
| `String` | `string` | 字符串类型 |
| `Number` | `number` | 数字类型，支持 Infinity 和 NaN |
| `Boolean` | `boolean` | 布尔类型 |
| `Enum` | 联合类型 | 枚举类型，自动提取所有值 |
| `EnumIndex` | 联合类型 | 枚举类型并作为索引 |
| `String[]` | `string[]` | 字符串数组 |
| `Number[]` | `number[]` | 数字数组 |
| `Enum[]` | 联合类型数组 | 枚举数组 |
| `Object` | 对象类型 | 解析 `key:value,key:value` 格式，自动推断值类型 |
| `Object[]` | 对象数组 | 分号分隔对象，对象内逗号分隔 `key:value`；n 个分号 → n+1 个对象，空对象槽位为 `{}` |

### 类型说明

- **Number**: 支持 `Infinity` 和 `NaN`
- **Enum**: 支持空字符串类型
- **Enum[]**: 联合类型包含数组中实际出现的所有值（含空槽位的 `""`）
- **EnumIndex**: 生成索引类型，使用 Enum 类型生成接口，同时生成 Map
- **Object**: 单元格格式为 `key:value,key:value`（如 `num:1,str:ab`），值自动推断为 number/boolean/string，跨所有行合并 key 生成专用类型
- **Object[]**: 与其他数组一致用**分号 `;` 分隔对象**，对象内仍用逗号分隔 `key:value`（与 `Object` 类型规则相同，多余逗号产生的空键值段忽略）。如 `num:1,,str:a;num:2` 生成 `[{num:1, str:'a'}, {num:2}]`；对象级空槽位（`a:1;;b:2`）按 n+1 规则保留为空对象 `{}`，空单元格为 `[]`；跨所有行合并 key 生成元素类型，字段类型为 `类型名[]`
- **数组空数据约定**: 所有数组类型（`String[]`/`Number[]`/`Enum[]`/`RefEnum[...] []`/`Object[]`）统一用**分号 `;` 分隔元素**——原始值统一清洗（去除 `\r\n` 等换行符、首尾空格）；空单元格生成 `[]`；非空时 n 个分号 → n+1 个槽位，所有槽位（含连续、首尾多余分号产生的）全部保留，保证并行数组按下标对齐。空槽位按类型自身零值生成：String/Enum/RefEnum 为 `''`，Number 为 `0`，Object[] 为 `{}`，**不生成 `null`**
- **未识别类型**: 类型名拼写错误等未识别类型会按 `string` 处理，并在转换时输出警告

### 生成的结构

每个 CSV 文件会生成一个 namespace，包含：

- 枚举类型定义（如果有 Enum 字段）
- `Record` 接口定义
- `List` 数据数组
- `Map` 索引映射（如果有 Index 或 EnumIndex 字段）

```typescript
export namespace DataCsv {
    export type mytype = "type1" | "type2";
    export const mytypeList: mytype[] = ["type1", "type2"];

    export interface Record {
        id: string;
        name: string;
        mytype: mytype;
    };

    export const List: Record[] = [ ... ];
    export const Map: { [id: string]: Record } = {};
}
```

## 引用功能

### Ref - 引用其他 CSV 的 Record

使用 `Ref[文件名]` 类型可以引用其他 CSV 文件的数据记录。

**语法：**
```csv
refField
Ref[other.csv]
```

**生成的代码：**
```typescript
export interface Record {
    refField: OtherCsv.Record;
};

export const List: Record[] = [
    {
        refField: OtherCsv.Map["key"],
    },
];
```

### RefEnum - 引用其他 CSV 的枚举类型

使用 `RefEnum[文件名.字段名]` 可以引用其他 CSV 的枚举类型。

**语法：**
```csv
myType
RefEnum[data.csv.mytype]
```

**生成的代码：**
```typescript
export interface Record {
    myType: DataCsv.mytype;
};
```

### RefEnum[] - 引用其他 CSV 的枚举数组类型

使用 `RefEnum[文件名.字段名][]` 可以引用其他 CSV 的枚举数组类型。

**语法：**
```csv
typeArr
RefEnum[data.csv.typearray][]
```

**生成的代码：**
```typescript
export interface Record {
    typeArr: DataCsv.typearray[];
};
```

### 引用示例

```csv
name,dataRecord,myType,typeArr
String,Ref[data.csv],RefEnum[data.csv.mytype],RefEnum[data.csv.typearray][]
"测试",1,"type1","t1, t2"
```

生成的 TypeScript 代码：

```typescript
export namespace NoIdCsv {
    export interface Record {
        name: string;
        dataRecord: DataCsv.Record;
        myType: DataCsv.mytype;
        typeArr: DataCsv.typearray[];
    };

    export const List: Record[] = [
        {
            name: '测试',
            dataRecord: DataCsv.Map["1"],
            myType: 'type1',
            typeArr: ['t1', 't2'],
        },
    ];
};
```

### 空值警告

当引用字段的值为空时，转换时会输出警告信息：

```
[config2ts] warning: NoIdCsv row 3 field "dataRecord" ref value is empty
[config2ts] warning: NoIdCsv row 3 field "myType" ref enum value is empty
```

## 资源索引（assets2ts）

使用 `-a, --assets <path>` 指定资源目录（默认 `public`），工具会递归扫描目录并在输出目录生成 `assets.ts`：

```bash
config2ts -d ./config -o ./src/types -n config.ts -a public
```

生成的 `ASSETS` 常量按目录结构嵌套组织，每个文件为 `{ path, type }`：

- `path` 为相对路径，`type` 为小写扩展名（如 `'png'`、`'mp3'`、`'svg'`）
- 文件名与目录名原样保留（如 `Direction.png` → `Direction`），含特殊字符的键自动加引号
- 含 2 个以上同格式文件的目录会生成专有类型（如 `PngAsset`、`Mp3Asset`）并标注 `satisfies Record<string, XxxAsset>`；只有 1 个文件或格式混杂的目录不加类型标注
- 支持嵌套目录（如 `public/sub/image/`）

```typescript
import { ASSETS } from "./assets";

const meta = ASSETS.public.image.Direction;
// meta.path → 'public/image/Direction.png'
// meta.type → 'png'
```

## 示例

### 基础 CSV 示例

**data.csv:**
```csv
id,name,type
Index,String,Enum
1,苹果,fruit
2,香蕉,fruit
3,胡萝卜,vegetable
```

**生成的 data.ts:**
```typescript
export namespace DataCsv {

    export type type = "fruit" | "vegetable";
    export const typeList: type[] = ["fruit", "vegetable"];

    export interface Record {
        id: string;
        name: string;
        type: type;
    };

    export const List: Record[] = [
        {
            id: '1',
            name: '苹果',
            type: 'fruit',
        },
        {
            id: '2',
            name: '香蕉',
            type: 'fruit',
        },
        {
            id: '3',
            name: '胡萝卜',
            type: 'vegetable',
        }
    ];

    export const Map: { [id: string]: Record } = {};
    for (const v of List) { Map[v.id] = v; };

};
```

### 完整项目结构

```
project/
├── config/
│   ├── data.csv
│   ├── item.csv
│   └── settings.ini
├── src/
│   └── types/
│       └── config.ts   <- 生成的文件
└── package.json
```

执行命令：
```bash
config2ts -d ./config -o ./src/types -n config.ts
```

## 常见问题

### 如何在 CI/CD 流程中集成？

在 `package.json` 中添加构建脚本，CI 中先安装依赖再执行转换：

```json
{
  "scripts": {
    "build:config": "config2ts -d config -o src/types -n config.ts",
    "build": "npm run build:config && tsc"
  }
}
```

### 支持 watch 模式（修改配置后自动重新生成）吗？

暂无内置 watch 模式，可借助文件监控工具实现：

```bash
npx nodemon --ext csv,ini,toml --exec "config2ts -d config -o src/types -n config.ts"
```

### 支持嵌套数据结构吗？

`Object` / `Object[]` 仅支持扁平的 `key:value` 键值对（值自动推导为 number/boolean/string），不支持对象内再嵌套对象。需要深层嵌套结构时：

- 使用 INI 或 TOML 格式（天然支持嵌套表）
- 将数据拆分为多个 CSV 文件，通过 `Ref` / `RefEnum` 建立跨表关联

### 生成的代码有类型错误或数据不符合预期怎么办？

1. 留意转换时的警告输出：类型名拼写错误等未识别类型会按 `string` 处理并告警；`Ref` / `RefEnum` 引用值为空也会告警
2. 检查 CSV 前两行（字段名行、类型行）是否正确；含逗号的字段需用双引号包裹
3. 生成文件带有 `DO NOT EDIT` 头，每次转换会整体覆盖，请勿在生成文件中手写定制内容

## 注意事项

1. **合并输出**: 所有配置文件会被合并为一个 TypeScript 文件输出
2. **命名空间**: 每个配置文件会生成独立的 namespace，名称为文件名的 PascalCase 形式
3. **BOM 支持**: 自动处理带 BOM 的 UTF-8 文件
4. **空行**: CSV 中的空行会被过滤掉（有 Index 字段时）
5. **引用顺序**: 被引用的文件需要在引用文件之前被处理（按文件名排序）
6. **引用路径**: 引用的文件必须在同一目录下
