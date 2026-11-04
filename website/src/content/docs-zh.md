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
| `--assets <path>` | `-a` | 资源目录，扫描生成 `assets.ts` 资源索引（可选，省略则不生成） | 无（默认不生成） |
| `--mode <mode>` | `-m` | 输出模式：`single` 合并为单文件 / `split` 每表一个文件并生成 `index.ts` | `single` |
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

### 输出模式（single / split）

通过 `-m, --mode` 选择输出模式。仓库 [`fixtures/`](https://github.com/livingyang/config2ts/tree/master/fixtures) 每个用例目录里都放着源表，以及该组源表在 **single 模式下合并**的产物 [`expected.ts`](https://github.com/livingyang/config2ts/blob/master/fixtures/03-cross-ref/expected.ts)，可直接对照；本站「功能用例」页也把每组源表与产物并排渲染。

**single 模式（默认）**：把所有配置表合并输出到一个文件（`-n` 指定文件名，默认 `csv.ts`）。

```bash
config2ts -d ./config -o ./src/types -m single -n config.ts
```

**split 模式**：每张表输出为独立的 `.ts` 文件（文件名取自源文件，如 `skill.csv` → `skill.ts`），并自动生成一个 `index.ts` 汇总所有表与 `assets.ts`。跨表的 `Ref`/`RefEnum`/`Template` 引用通过在使用方文件顶部注入 `import` 语句解析，因此每个表都可被独立引用与 tree-shaking。

```bash
config2ts -d ./config -o ./src/types -m split
```

- split 模式下 `-n` 复用为索引文件名；若保留 single 模式的默认 `csv.ts`，则自动改用 `index.ts`（除非显式传入 `-n`）
- `-a` 为可选项，省略则不生成 `assets.ts`

split 模式在 `dist` 下的输出结构：

```
dist/
  z-base.ts        # export namespace ZBaseCsv { ... }
  a-user.ts        # import { ZBaseCsv } from "./z-base"; export namespace AUserCsv { ... }
  skill.ts
  ...
  assets.ts        # 仅当传入 -a 时生成
  index.ts         # export * from "./z-base"; export * from "./a-user"; ...; export * from "./assets";
```

> 两种模式下，被引用的表始终按引用关系拓扑排序输出在引用表之前；缺失/循环引用会输出同样的告警。

### 同构子目录合并

`-d` 目录下的一级子目录如果满足：**内部全部是 CSV，且所有文件的表头行与类型行完全一致**，就会被合并导出为**一个与子目录同名的表**（`story/ch01.csv`、`story/ch02.csv`、`story/ch03.csv` → `StoryCsv`）。数据行按文件名字典序拼接，只有第一个文件的表头/类型行保留。可运行的完整示例见 [fixtures/08-story](https://github.com/livingyang/config2ts/tree/master/fixtures/08-story)（多章节剧情：每章一个文件独立维护，运行时只加载一张 `StoryCsv` 表）。

适用场景：按章节/语言/关卡拆分的同构表——文件多了不好管理，合并后又不想手工拼接。合并时若主键列（`Index`/`EnumIndex`）出现重复值会输出告警。不满足同构条件（表头或类型行不一致、混入 ini/toml、没有可转换文件）的子目录会输出告警并跳过，不影响其余文件。

```csv
# story/ch01.csv（ch02.csv、ch03.csv 表头与类型行完全相同）
id,chapter,seq,type,speaker,text,key,color,kind
Index,String,Number,Enum,String,String,String,String,Enum
n0101,ch01,10,bg,,,bg_diner_dusk,#2b2118,
n0102,ch01,20,line,旁白,"海风把旧招牌吹得吱呀作响。",,,
```

```typescript
// 三个文件合并导出为一个命名空间
StoryCsv.List;  // 28 行 = ch01 + ch02 + ch03 的全部节点
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
| `Ref[table]` | `表名.Record` | 引用其他表整行，值为目标行 Index，生成 `表名.Map["id"]` |
| `Ref[table][]` | `表名.Record[]` | 引用数组，逗号分隔多个 Index，生成 `[表名.Map["id"],...]` |
| `RefEnum[table.field]` | `表名.字段名` | 引用其他表的枚举字段 |
| `RefEnum[table.field][]` | `表名.字段名[]` | 引用其他表的枚举数组 |
| `Template[table]` | `表名.Record` | 模板继承：以目标表一行为原型并覆盖部分字段，单元格 `id\|key:value,...`，数组/对象值用 `[..]`/`{..}` 包裹，无覆盖项时等同 `Ref[table]` |
| `Template[table][]` | `表名.Record[]` | 模板数组，分号 `;` 分隔多个模板条目（同 `Object[]`） |
| `RefTable[table]` | `表名.Record[]` | 引用同构子目录合并表的子表：值为成员文件名（`FileMap` 的 key），生成 `表名.subTable("文件名")`（见用例 08-story） |
| `RefTable[table][]` | `表名.Record[][]` | 子表引用数组，逗号分隔多个成员文件名 |

### 类型说明

- **Number**: 支持 `Infinity` 和 `NaN`
- **Enum**: 支持空字符串类型
- **Enum[]**: 联合类型包含数组中实际出现的所有值（含空槽位的 `""`）
- **EnumIndex**: 生成索引类型，使用 Enum 类型生成接口，同时生成 Map
- **Object**: 单元格格式为 `key:value,key:value`（如 `num:1,str:ab`），值自动推断为 number/boolean/string，跨所有行合并 key 生成专用类型
- **Object[]**: 对象之间用**分号 `;` 分隔**（逗号留给对象内的 `key:value`，与 `Object` 类型规则相同，多余逗号产生的空键值段忽略）。如 `num:1,,str:a;num:2` 生成 `[{num:1, str:'a'}, {num:2}]`；对象级空槽位（`a:1;;b:2`）按 n+1 规则保留为空对象 `{}`（纯分号 `;` 生成 `[{},{}]`），空单元格为 `[]`；跨所有行合并 key 生成元素类型，字段类型为 `类型名[]`
- **数组分隔符与空数据约定**: 原始类型数组（`String[]`/`Number[]`/`Enum[]`/`RefEnum[...] []`）用**逗号 `,` 分隔元素**，`Object[]` 用**分号 `;` 分隔对象**（因为逗号已用于对象内键值对）；原始值统一清洗（`\r\n`/`\r` 换行统一为 `\n`、首尾空格去除）；空单元格生成 `[]`；非空时 n 个分隔符 → n+1 个槽位，所有槽位（含连续、首尾多余分隔符产生的）全部保留，保证并行数组按下标对齐。空槽位按类型自身零值生成：String/Enum/RefEnum 为 `''`，Number 为 `0`，Object[] 空对象槽为 `{}`，**不生成 `null`**
- **换行约定**: `String` 字段保留单元格内的换行（多行文本，CSV 中需用双引号包裹），生成代码中转义为 `\n`；**结构化字段中换行等价于其分隔符**——原始数组/Object 键值对/Template 覆盖项中换行等同逗号（如 `a\nb` → `['a','b']`、`num:1\nstr:x` → `{num:1,str:'x'}`），Object[]/Template[] 中换行等同分号（每行一个对象/模板条目，空行按 n+1 规则为空槽位）；标量字段（Number/Boolean/Enum/EnumIndex/单值 Ref）没有分隔符语义，单元格内含换行会输出警告，请去除换行
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

使用 `Ref[表名]` 类型可以引用其他 CSV 文件的数据记录。

> **表名写法**：默认写去扩展名的表名，`Ref[skill]` 即引用 `skill.csv`（生成命名空间 `SkillCsv`）。写完整文件名（`Ref[skill.csv]`）同样兼容，精确匹配优先；当去扩展名后同名的表多于一个（如 `skill.csv` 与 `skill.ini` 并存）时存在歧义，必须写全名，否则输出告警。`RefEnum` / `Template` / `RefTable` 遵循同一规则。

**语法：**
```csv
refField
Ref[other]
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

使用 `Ref[表名][]` 类型可以一次引用其他 CSV 的多行记录（逗号分隔多个目标行 Index），适合"一组有身份的子对象"场景（如奖励组、波次配置）；内联私有的结构化列表应使用 `Object[]`。

**语法：**
```csv
refArr
Ref[other][]
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

使用 `RefEnum[表名.字段名]` 可以引用其他 CSV 的枚举类型。

**语法：**
```csv
myType
RefEnum[data.mytype]
```

**生成的代码：**
```typescript
export interface Record {
    myType: DataCsv.mytype;
};
```

### RefEnum[] - 引用其他 CSV 的枚举数组类型

使用 `RefEnum[表名.字段名][]` 可以引用其他 CSV 的枚举数组类型。

**语法：**
```csv
typeArr
RefEnum[data.typearray][]
```

**生成的代码：**
```typescript
export interface Record {
    typeArr: DataCsv.typearray[];
};
```

### Template - 模板继承（引用整行并覆盖字段）

使用 `Template[表名]` 可以引用其他 CSV 的一行作为"原型"，再覆盖其中部分字段，适合"基础配置 + 少量变体"场景（如精英怪物、强化道具），避免整行复制。

**语法：** 单元格为 `<基行Index>|<key>:<value>,<key>:<value>`——`|` 前是基行 id（与 `Ref` 的值含义相同），`|` 后是覆盖项，逗号分隔多个 `key:value`。没有覆盖项时省略 `|` 及之后内容即可，此时与 `Ref` 完全等价。

覆盖值支持三种形态（括号写法与生成的 TypeScript 语法一致，括号内的逗号不会被当作键值对分隔符）：

| 目标字段类型 | 覆盖值写法 | 示例 |
| :--- | :--- | :--- |
| 标量（Number/Boolean/String/Enum） | 裸值 | `damage:150`、`kind:attack` |
| 数组（Number[]/String[]/Enum[] 等） | `[v1,v2,...]` | `Params:[6,2.07]` |
| 对象（Object，整体替换） | `{k:v,k:v}` | `params:{damage:100,range:5}` |

```csv
base
Template[skill]
101|damage:150,range:8
102|params:{heal:500,target:ally}
103|Params:[6,2.07]
104
```

> 注意数组值**必须加方括号**：写 `Params:6,2.07` 会被逗号切碎（只取到 `Params:6`，`2.07` 成为无键名的游离段），转换时会输出警告提示改用 `Params:[6,2.07]`。

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
        base: { ...SkillCsv.Map["102"], params: { heal: 500, target: 'ally' } },
    },
    {
        base: { ...SkillCsv.Map["103"], Params: [6, 2.07] },
    },
    {
        base: SkillCsv.Map["104"],   // 无覆盖项，输出与 Ref 一致
    },
];
```

**类型安全：** 覆盖字段名拼错、值类型不符（如数组字段漏写括号变成标量）、枚举字段写成非法值都会在 tsc 编译期报错；空单元格、基行 id 为空（如 `|damage:1`）、游离的覆盖段都会在转换时输出警告。

> 覆盖项写在**顶层字段**上（不支持点路径深层覆盖）；`{...}` 对象值与 `Object` 类型一样只支持扁平 `key:value`（不支持对象内再嵌套数组/对象）；目标表必须有 `Index`/`EnumIndex`（即生成了 `Map`，EnumIndex 表以枚举值为 id）；表的输出顺序由引用关系自动排列，无需手工调整文件名——以上约束与 `Ref` 相同。

### Template[] - 模板数组

使用 `Template[表名][]` 可以在一个单元格内写多个模板条目，条目之间用**分号 `;` 分隔**（与 `Object[]` 的元素分隔符一致），每个条目内部规则与单个 `Template` 相同：
```csv
rewards
Template[item][]
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

### RefTable - 引用同构子目录合并表的子表

使用 `RefTable[表名]` 可以引用"同构子目录合并表"中的一张子表：单元格填写成员文件名（即生成代码中 `File` 联合类型的成员），生成 `表名.subTable("文件名")`，字段类型为 `表名.Record[]`。适合"章节目录 + 章节索引"场景（见用例 08-story）：

```csv
id,chapter,title,story
Index,Number,String,RefTable[story]
ch01,1,重开的招牌,ch01
```

生成的代码中 `story` 字段即为该章节文件的全部数据行：

```typescript
export interface Record {
    story: StoryCsv.Record[];
};

export const List: Record[] = [
    {
        story: StoryCsv.subTable("ch01"),
    },
];
```

> 合并表无需 `Index` 列，成员文件名就是子表的 key；也不会生成扁平的 `List`（会与 `FileMap` 逐行重复），只导出按文件名分组的 `FileMap`。引用目标参与拓扑排序，被引用的合并表总是先输出。
>
> **有效性约束**：合并表会生成 `File` 字面量联合类型（`"ch01" | "ch02" | ...`）与 `subTable(file: File)` 访问器，`RefTable` 单元格填写不存在的文件名时 tsc 直接编译报错（参数类型不匹配，与是否开启 `strict` 无关）；转换阶段也会告警并列出合法文件名，无需编译即可发现问题。

### 引用示例

```csv
name,dataRecord,myType,typeArr
String,Ref[data],RefEnum[data.mytype],RefEnum[data.typearray][]
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

`Template` 字段同样会对空单元格（`template value is empty`）、基行 id 为空（`template base id is empty`）、模板数组中的空 id 槽位（`template array entry N has an empty base id`）以及游离覆盖段（`template override segment ... is not a key:value pair`，通常是数组值漏写 `[..]` 括号被逗号切碎）输出警告。

标量字段（Number/Boolean/Enum/EnumIndex/单值 Ref/RefEnum）的单元格内含换行时，会输出 `contains a line break inside the cell` 警告——这类字段没有分隔符语义，请去除换行；结构化字段（数组/Object/Template）中的换行是合法分隔符，不会告警。

引用关系问题也会在合并扫描阶段告警：

- **循环引用**：`circular table reference detected: a.csv -> b.csv -> a.csv`——环路上的表运行时可能引用到 undefined 的 namespace，需手工打断循环（去掉其中一个引用或拆表）
- **引用文件不存在**：`x.csv references "y.csv" but no config file with that name was found`——检查文件名拼写与扩展名

## 常见建模场景

本节场景的源文件都在仓库 [`fixtures/`](https://github.com/livingyang/config2ts/tree/master/fixtures) 里（场景一 → `03-cross-ref`，场景二 → `07-i18n`，场景三 → `04-refs-and-templates`）；每个用例目录的 `expected.ts` 就是这组源表的 single 模式合并结果，由 `npm run fixtures:regen` 生成。

### 选型原则：Object[] 还是 Ref[]？

- **内联、私有、一次性**的结构化列表（坐标点、波次参数）→ `Object[]`，数据直接写在单元格里
- **有身份、要复用、有多组数据**的对象（技能、道具、奖励项）→ 提成独立 CSV 表，用 `Ref` / `Ref[]` 关联，白送类型安全与跨表枚举
- `Object` 单元格是**扁平**的 `key:value`，不支持嵌套对象/数组值；需要层级就拆表

### 场景一：角色-技能-等级（异构字段 + 多组数值）

需求：每个角色有多个技能；技能之间参数字段不同；同一技能有多组数值（等级）。拆三张表：

**1. 技能表** [skill.csv](https://github.com/livingyang/config2ts/blob/master/fixtures/03-cross-ref/skill.csv) —— 异构参数收进 `Object` 字段，跨所有技能合并 key，缺失字段自动可选：

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

**2. 等级数值表** [skilllevel.csv](https://github.com/livingyang/config2ts/blob/master/fixtures/03-cross-ref/skilllevel.csv) —— 每行是"技能 × 一组数值"，用 `Ref[skill]` 关联回技能：

```csv
id,skill,level,damage,heal,manaCost
Index,Ref[skill],Number,Number,Number,Number
1,101,1,100,0,20
2,101,2,150,0,30
3,102,1,0,200,40
```

消费侧按技能分组取数值：

```typescript
const lv2 = SkilllevelCsv.List.filter(lv => lv.skill === SkillCsv.Map["101"])
                              .find(lv => lv.level === 2);  // damage 150
```

> 如果数值是"角色学到的等级不同"而非技能固有成长，再建一张角色-技能关联表（`Ref[unit]` + `Ref[skill]` + `level`），不要在角色表里直接存等级。

**3. 角色表** [unit.csv](https://github.com/livingyang/config2ts/blob/master/fixtures/03-cross-ref/unit.csv) —— 用 `Ref[skill][]` 引用多个技能：

```csv
id,name,skills
Index,String,Ref[skill][]
1,hero1,"101,102"
```

生成 `skills: SkillCsv.Record[]`，数据为 `[SkillCsv.Map["101"], SkillCsv.Map["102"]]`，运行时直接拿到技能对象。

> **文件顺序**：工具会扫描所有 `Ref`/`RefEnum`/`Template` 引用并自动做拓扑排序——被引用的表总是输出在引用表之前，文件名不再需要手工排序（旧的 `!` 前缀等技巧已无必要）；无引用关系的表保持文件名字典序。检测到循环引用（A→B→A）时会输出告警并指出环路，需要手工打断循环。

### 场景二：描述文本本地化（i18n）

原则：**配置表里只放翻译 key 和模板，不放死文本；数值全部走具名占位符，运行时填充。**

默认用**单表多列**（[text.csv](https://github.com/livingyang/config2ts/blob/master/fixtures/07-i18n/text.csv)）：一行一个 key，每种语言占一列，key 约定 `{类型}.{id}.{字段}`（无 id 的文案省略中段，如 `ui.title`）：

```csv
key,zh,en,ja
Index,String,String,String
ui.title,海畔餐厅,Seaside Diner,海辺の食堂
line.orders,今天已有 {count} 位客人点单。,{count} guests ordered today.,本日は {count} 名の注文がありました。
```

生成单个命名空间 `TextCsv`，每行同时带着所有语言的字段（`TextCsv.Map[key].zh` / `.en` / `.ja`）。运行时一个 helper 按当前语言取列并填充占位符：

```typescript
let locale: "zh" | "en" | "ja" = "zh";

export function t(key: string, params?: Record<string, string | number>): string {
  let tpl = TextCsv.Map[key]?.[locale] || TextCsv.Map[key]?.zh || key;  // 缺翻译回退
  if (params) {
    tpl = tpl.replace(/\{(\w+)\}/g, (_, k) => k in params ? String(params[k]) : "");
  }
  return tpl;
}

t("line.orders", { count: 3 });  // → "今天已有 3 位客人点单。"
t("ui.title");                   // → "海畔餐厅"
```

为什么默认单表：加一个 key 只动一行、漏译在同一行上空着就能看见、翻译与配置在同一个 diff 里 review；语言集合固定且数量少时最省心。

> **备选：按语言拆表**（`lang-zh.csv` / `lang-en.csv`，同 key 对齐，每语言生成一个命名空间）。语言集合开放（运行时按语言增删文件）、或译者独立维护自己的文件时更合适；代价是同一个 key 的翻译散在多份文件里，漏译需要脚本检查。

约定：

- 同一技能各等级共用一条模板，数值来自等级表；等级专属文案再加 key 层级（如 `skill.101.desc.lv2`）
- **单元格支持真实换行**（Excel 中 Alt+Enter，CSV 中用双引号包裹多行单元格）：`String` 字段换行保留为 `\n`；结构化字段中换行等价于分隔符（数组元素/键值对之间换行等同逗号，模板数组中每行一个模板条目等同分号），策划可以按"每行一条"排版；仅 Number/Boolean/Enum/单值 Ref 等标量字段不支持换行（转换时告警）
- 列名直接用语言代码（`zh` / `en` / `ja`），与运行时 locale 对齐，不要用 `chinese` 这类别名
- 某语言缺翻译时该单元格为空 → `zh: ''`，可在 helper 中检测并回退/告警
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
# monsterelite.csv —— 变体表（输出顺序由引用关系自动排列）
id,name,base
Index,String,Template[monster]
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

使用 `-a, --assets <path>` 指定资源目录（可选，省略则不生成 `assets.ts`），工具会递归扫描目录并在输出目录生成 `assets.ts`：

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

1. **输出模式**: 默认 `single` 模式把所有配置文件合并为一个 TypeScript 文件输出；使用 `-m split` 则会每张表生成一个独立文件，并额外生成 `index.ts` 汇总所有表与 `assets.ts`
2. **命名空间**: 每个配置文件会生成独立的 namespace，名称为文件名的 PascalCase 形式
3. **BOM 支持**: 自动处理带 BOM 的 UTF-8 文件
4. **空行**: CSV 中的空行会被过滤掉（有 Index 字段时）
5. **引用顺序**: 工具扫描 `Ref`/`RefEnum`/`Template` 引用关系并自动拓扑排序，被引用表保证输出在引用表之前；无引用关系的表按文件名字典序排列，无需手工命名控制顺序
6. **引用路径**: 引用的文件必须在同一目录下
7. **Template 覆盖项**: 单元格用 `|` 分隔基行 id 与覆盖项（`id|key:value,key:value`），`Template[]` 用 `;` 分隔多个条目；标量值裸写，数组值必须用 `[..]` 包裹（如 `Params:[6,2.07]`），对象值用 `{..}` 整体替换；覆盖字段为顶层平铺，不支持点路径深层覆盖；转换期不校验目标表字段，键名或值类型有误在 tsc 编译期报错
8. **换行**: `String` 字段换行保留为 `\n`；结构化字段（数组/Object/Object[]/Template/Template[]）中换行等价于对应分隔符（逗号或分号），支持"每行一条"排版，空行按 n+1 规则成为空槽；标量字段（Number/Boolean/Enum/单值 Ref）含换行时转换会告警，需去除；多行单元格在 CSV 中需用双引号包裹
9. **大表降级**: 行数超过 1000 的表，`Record` 中作为唯一键的 `EnumIndex` 字段类型会从枚举联合回退为 `string`，其余字段不变；这样每一行对象字面量类型完全相同，可避免单个 `List` 数组字面量包含过多对象字面量类型时 tsc 的 `ts(2590) Expression produces a union type that is too complex to represent` 报错。`key` 联合类型与 `keyList` 仍照常生成（它们不会触发该限制），跨表 `RefEnum` 引用不受影响；代价是该大表的 `Record` 的键字段失去字面量级类型校验
