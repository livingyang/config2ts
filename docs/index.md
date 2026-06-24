# config2ts 中文文档

将配置文件（csv、ini、toml）转换为 TypeScript 类型定义文件。

## 目录

- [快速开始](#快速开始)
- [安装](#安装)
- [命令行使用](#命令行使用)
- [支持的配置格式](#支持的配置格式)
- [CSV 字段类型](#csv-字段类型)
- [引用功能](#引用功能)
- [示例](#示例)
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

### 类型说明

- **Number**: 支持 `Infinity` 和 `NaN`
- **Enum**: 支持空字符串类型
- **Enum[]**: 不包含空字符串类型
- **EnumIndex**: 生成索引类型，使用 Enum 类型生成接口，同时生成 Map

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

## 注意事项

1. **合并输出**: 所有配置文件会被合并为一个 TypeScript 文件输出
2. **命名空间**: 每个配置文件会生成独立的 namespace，名称为文件名的 PascalCase 形式
3. **BOM 支持**: 自动处理带 BOM 的 UTF-8 文件
4. **空行**: CSV 中的空行会被过滤掉（有 Index 字段时）
5. **引用顺序**: 被引用的文件需要在引用文件之前被处理（按文件名排序）
6. **引用路径**: 引用的文件必须在同一目录下
