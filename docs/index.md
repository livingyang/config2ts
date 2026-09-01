# config2ts 中文文档

将配置文件（csv、ini、toml）转换为 TypeScript 类型定义文件。

## 目录

- [快速开始](#快速开始)
- [安装](#安装)
- [命令行使用](#命令行使用)
- [支持的配置格式](#支持的配置格式)
- [CSV 字段类型](#csv-字段类型)
- [引用功能](#引用功能)
- [常见建模场景](#常见建模场景)
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
| `Ref[file]` | `表名.Record` | 引用其他表整行，值为目标行 Index，生成 `表名.Map["id"]` |
| `Ref[file][]` | `表名.Record[]` | 引用数组，逗号分隔多个 Index，生成 `[表名.Map["id"],...]` |
| `RefEnum[file.field]` | `表名.字段名` | 引用其他表的枚举字段 |
| `RefEnum[file.field][]` | `表名.字段名[]` | 引用其他表的枚举数组 |
| `Template[file]` | `表名.Record` | 模板继承：以目标表一行为原型并覆盖部分字段，单元格 `id\|key:value,...`，无覆盖项时等同 `Ref[file]` |
| `Template[file][]` | `表名.Record[]` | 模板数组，分号 `;` 分隔多个模板条目（同 `Object[]`） |

### 类型说明

- **Number**: 支持 `Infinity` 和 `NaN`
- **Enum**: 支持空字符串类型
- **Enum[]**: 联合类型包含数组中实际出现的所有值（含空槽位的 `""`）
- **EnumIndex**: 生成索引类型，使用 Enum 类型生成接口，同时生成 Map
- **Object**: 单元格格式为 `key:value,key:value`（如 `num:1,str:ab`），值自动推断为 number/boolean/string，跨所有行合并 key 生成专用类型
- **Object[]**: 对象之间用**分号 `;` 分隔**（逗号留给对象内的 `key:value`，与 `Object` 类型规则相同，多余逗号产生的空键值段忽略）。如 `num:1,,str:a;num:2` 生成 `[{num:1, str:'a'}, {num:2}]`；对象级空槽位（`a:1;;b:2`）按 n+1 规则保留为空对象 `{}`（纯分号 `;` 生成 `[{},{}]`），空单元格为 `[]`；跨所有行合并 key 生成元素类型，字段类型为 `类型名[]`
- **数组分隔符与空数据约定**: 原始类型数组（`String[]`/`Number[]`/`Enum[]`/`RefEnum[...] []`）用**逗号 `,` 分隔元素**，`Object[]` 用**分号 `;` 分隔对象**（因为逗号已用于对象内键值对）；原始值统一清洗（去除 `\r\n` 等换行符、首尾空格）；空单元格生成 `[]`；非空时 n 个分隔符 → n+1 个槽位，所有槽位（含连续、首尾多余分隔符产生的）全部保留，保证并行数组按下标对齐。空槽位按类型自身零值生成：String/Enum/RefEnum 为 `''`，Number 为 `0`，Object[] 空对象槽为 `{}`，**不生成 `null`**
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

### Ref[] - 引用其他 CSV 的 Record 数组

使用 `Ref[文件名][]` 类型可以一次引用其他 CSV 的多行记录（逗号分隔多个目标行 Index），适合"一组有身份的子对象"场景（如奖励组、波次配置）；内联私有的结构化列表应使用 `Object[]`。

**语法：**
```csv
refArr
Ref[other.csv][]
```
单元格写逗号分隔的多个 Index（数组写法与 `String[]` 一致，空单元格为 `[]`，空槽位按数组 n+1 规则保留）：
```csv
"key1,key2"
```

**生成的代码：**
```typescript
export interface Record {
    refArr: OtherCsv.Record[];
};

export const List: Record[] = [
    {
        refArr: [OtherCsv.Map["key1"],OtherCsv.Map["key2"]],
    },
];
```

> 数组中出现空 id（如 `"key1,,key2"`）会生成 `OtherCsv.Map[""]`（运行时为 `undefined`）并输出警告。

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

### Template - 模板继承（引用整行并覆盖字段）

使用 `Template[文件名]` 可以引用其他 CSV 的一行作为"原型"，再覆盖其中部分字段，适合"基础配置 + 少量变体"场景（如精英怪物、强化道具），避免整行复制。

**语法：** 单元格为 `<基行Index>|<key>:<value>,<key>:<value>`——`|` 前是基行 id（与 `Ref` 的值含义相同），`|` 后是覆盖项，写法与 `Object` 一致（逗号分隔 `key:value`，值自动推断 number/boolean/string）。没有覆盖项时省略 `|` 及之后内容即可，此时与 `Ref` 完全等价。
```csv
base
Template[skill.csv]
101|damage:150,range:8
102
```

**生成的代码：** 运行时展开为对象 spread（不修改基行数据），字段类型就是目标表的 `Record`：
```typescript
export interface Record {
    base: SkillCsv.Record;
};

export const List: Record[] = [
    {
        base: { ...SkillCsv.Map["101"], damage: 150, range: 8 },
    },
    {
        base: SkillCsv.Map["102"],   // 无覆盖项，输出与 Ref 一致
    },
];
```

**类型安全：** 覆盖字段名拼错、值类型不符、枚举字段写成非法值都会在 tsc 编译期报错；空单元格、基行 id 为空（如 `|damage:1`）会在转换时输出警告。

> 覆盖仅支持**顶层平铺字段**（与 `Object` 的 flat 语法一致，不支持点路径深层覆盖）；目标表必须有 `Index`/`EnumIndex`（即生成了 `Map`）；被引用表的文件名排序需在引用表之前——以上约束与 `Ref` 相同。

### Template[] - 模板数组

使用 `Template[文件名][]` 可以在一个单元格内写多个模板条目，条目之间用**分号 `;` 分隔**（与 `Object[]` 的元素分隔符一致），每个条目内部规则与单个 `Template` 相同：
```csv
rewards
Template[item.csv][]
"1001|damage:200;1002|count:5;1003"
```

**生成的代码：**
```typescript
export interface Record {
    rewards: ItemCsv.Record[];
};

export const List: Record[] = [
    {
        rewards: [{ ...ItemCsv.Map["1001"], damage: 200 }, { ...ItemCsv.Map["1002"], count: 5 }, ItemCsv.Map["1003"]],
    },
];
```

> 空单元格生成 `[]`；n 个分号保持 n+1 个槽位（与其他数组一致），基行 id 为空的槽位（如 `1001|x:1;;1003` 中间的空段）会输出警告。

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

`Template` 字段同样会对空单元格（`template value is empty`）、基行 id 为空（`template base id is empty`）以及模板数组中的空 id 槽位（`template array entry N has an empty base id`）输出警告。

## 常见建模场景

本节场景均可在仓库 [config/](https://github.com/livingyang/config2ts/tree/master/config) 目录找到对应源文件，生成结果合并于 `total.ts`（即测试夹具，始终与最新语法一致）。

### 选型原则：Object[] 还是 Ref[]？

- **内联、私有、一次性**的结构化列表（坐标点、波次参数）→ `Object[]`，数据直接写在单元格里
- **有身份、要复用、有多组数据**的对象（技能、道具、奖励项）→ 提成独立 CSV 表，用 `Ref` / `Ref[]` 关联，白送类型安全与跨表枚举
- `Object` 单元格是**扁平**的 `key:value`，不支持嵌套对象/数组值；需要层级就拆表

### 场景一：角色-技能-等级（异构字段 + 多组数值）

需求：每个角色有多个技能；技能之间参数字段不同；同一技能有多组数值（等级）。拆三张表：

**1. 技能表** [skill.csv](https://github.com/livingyang/config2ts/blob/master/config/skill.csv) —— 异构参数收进 `Object` 字段，跨所有技能合并 key，缺失字段自动可选：

```csv
id,name,kind,params
Index,String,Enum,Object
101,fireball,attack,"damage:100,range:5,element:fire"
102,heal,support,"heal:200,target:ally"
```

生成类型（火球术没有 `heal`、治疗没有 `damage`，均为可选）：

```typescript
export type params = {
    damage?: number; range?: number; element?: string;
    heal?: number; target?: string;
};
```

**2. 等级数值表** [skilllevel.csv](https://github.com/livingyang/config2ts/blob/master/config/skilllevel.csv) —— 每行是"技能 × 一组数值"，用 `Ref[skill.csv]` 关联回技能：

```csv
id,skill,level,damage,heal,manaCost
Index,Ref[skill.csv],Number,Number,Number,Number
1,101,1,100,0,20
2,101,2,150,0,30
3,102,1,0,200,40
```

消费侧按技能分组取数值：

```typescript
const lv2 = SkilllevelCsv.List.filter(lv => lv.skill === SkillCsv.Map["101"])
                              .find(lv => lv.level === 2);  // damage 150
```

> 如果数值是"角色学到的等级不同"而非技能固有成长，再建一张角色-技能关联表（`Ref[unit.csv]` + `Ref[skill.csv]` + `level`），不要在角色表里直接存等级。

**3. 角色表** [unit.csv](https://github.com/livingyang/config2ts/blob/master/config/unit.csv) —— 用 `Ref[skill.csv][]` 引用多个技能：

```csv
id,name,skills
Index,String,Ref[skill.csv][]
1,hero1,"101,102"
```

生成 `skills: SkillCsv.Record[]`，数据为 `[SkillCsv.Map["101"], SkillCsv.Map["102"]]`，运行时直接拿到技能对象。

> **文件顺序**：被引用的表按文件名需排在引用表之前（工具按文件名排序处理），故命名为 `skill.csv` < `skilllevel.csv` < `unit.csv`。

### 场景二：描述文本本地化（i18n）

原则：**配置表里只放翻译 key 和模板，不放死文本；数值全部走具名占位符，运行时填充。**

每种语言一个 CSV（[lang-en.csv](https://github.com/livingyang/config2ts/blob/master/config/lang-en.csv) / [lang-zh.csv](https://github.com/livingyang/config2ts/blob/master/config/lang-zh.csv)），key 约定 `{类型}.{id}.{字段}`：

```csv
id,text
Index,String
skill.101.name,火球术
skill.101.desc,"对 {range} 米内的敌人造成 {damage} 点火焰伤害。"
```

两文件 key 集合保持一致，生成两个形状相同的命名空间（`LangZhCsv.Map[key].text` / `LangEnCsv.Map[key].text`）。运行时一个 helper 完成查表与占位符填充（占位符名与技能 params/等级表字段名一致）：

```typescript
const tables = { en: LangEnCsv, zh: LangZhCsv } as const;
let locale: keyof typeof tables = "zh";

export function t(key: string, params?: Record<string, string | number>): string {
  let tpl = tables[locale].Map[key]?.text ?? key;      // 缺翻译回退到 key
  if (params) {
    tpl = tpl.replace(/\{(\w+)\}/g, (_, k) => k in params ? String(params[k]) : "");
  }
  return tpl;
}

t(`skill.${skill.id}.desc`, lv);  // lv 来自 skilllevel 表 → "对 5 米内的敌人造成 150 点火焰伤害。"
```

约定：

- 同一技能各等级共用一条模板，数值来自等级表；等级专属文案再加 key 层级（如 `skill.101.desc.lv2`）
- 单元格文本**不能含换行**（会被清洗）；需要换行写字面量 `\n` 由 helper 替换
- 某语言缺翻译时单元格为空 → `text: ''`，可在 helper 中检测并回退/告警
- 枚举显示名、道具名、Buff 名等所有面向玩家的文本统一走语言表

### 场景三：基础行 + 变体（Template 模板继承）

需求：大量配置行只有少数字段不同（普通/精英/首领怪物、强化前后的道具）。把公共配置放在基础表，变体行用 `Template` 引用基础行并只写差异字段，避免整行复制后改漏：

```csv
# monster.csv —— 基础怪物表
id,name,hp,damage
Index,String,Number,Number
m1,goblin,100,10
m2,orc,300,25
```

```csv
# monsterelite.csv —— 变体表（文件名排序在基础表之后）
id,name,base
Index,String,Template[monster.csv]
e1,goblin-elite,"m1|hp:250,damage:20"
b1,orc-boss,"m2|hp:2000,damage:80"
```

生成的 `base` 字段类型为 `MonsterCsv.Record`，运行时是 `{ ...MonsterCsv.Map["m1"], hp: 250, damage: 20 }`——基行不被修改，变体拥有完整字段，消费侧无需区分"原型"和"变体"：

```typescript
for (const v of MonstereliteCsv.List) {
  console.log(v.name, v.base.hp, v.base.damage);  // 字段与基础表完全一致
}
```

约定：

- 变体只覆盖**顶层平铺字段**；差异本身是一组有身份、可复用的数据（技能、掉落项）时仍应拆表用 `Ref`
- 一行需要挂多个变体对象时用 `Template[file][]`（`;` 分隔多个条目）
- 覆盖字段名拼错或值类型写错会在 tsc 编译期报错，不用等运行时

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

1. 留意转换时的警告输出：类型名拼写错误等未识别类型会按 `string` 处理并告警；`Ref` / `RefEnum` 引用值为空、`Ref[]` 数组含空 id 槽位也会告警
2. 检查 CSV 前两行（字段名行、类型行）是否正确；含逗号的字段需用双引号包裹
3. 生成文件带有 `DO NOT EDIT` 头，每次转换会整体覆盖，请勿在生成文件中手写定制内容

## 注意事项

1. **合并输出**: 所有配置文件会被合并为一个 TypeScript 文件输出
2. **命名空间**: 每个配置文件会生成独立的 namespace，名称为文件名的 PascalCase 形式
3. **BOM 支持**: 自动处理带 BOM 的 UTF-8 文件
4. **空行**: CSV 中的空行会被过滤掉（有 Index 字段时）
5. **引用顺序**: 被引用的文件需要在引用文件之前被处理（按文件名排序）
6. **引用路径**: 引用的文件必须在同一目录下
7. **Template 覆盖项**: 单元格用 `|` 分隔基行 id 与覆盖项（`id|key:value,key:value`），`Template[]` 用 `;` 分隔多个条目；覆盖字段为顶层平铺，不支持点路径深层覆盖；转换期不校验目标表字段，键名或值类型有误在 tsc 编译期报错
