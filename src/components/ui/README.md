# UI 组件说明

## PaperEntry 组件

### 介绍
PaperEntry 是一个独立的"泡泡纸条"按钮组件，用于创建新纸条，可以在页面中任意位置使用。

### 特性
- 默认跳转到 `/notes/new` 页面
- 支持自定义点击事件
- 支持自定义样式
- 统一的视觉样式

### 使用方法

#### 基础用法
```tsx
import PaperEntry from '@/components/ui/PaperEntry';

// 默认行为：点击跳转到 /notes/new
<PaperEntry />
```

#### 自定义点击事件
```tsx
<PaperEntry
  onClick={() => {
    console.log('自定义点击事件');
    router.push('/custom-path');
  }}
/>
```

#### 自定义样式
```tsx
<PaperEntry
  className="transform scale-110 shadow-lg"
/>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `className` | `string` | `undefined` | 自定义 CSS 类名 |
| `onClick` | `() => void` | `undefined` | 自定义点击事件，未提供时默认跳转到 `/notes/new` |

### 使用场景

1. **TopBar 中间位置**（通过 `showPaperEntry` 属性）
2. **页面任意位置**（独立使用）
3. **浮动按钮**（结合定位样式）
4. **工具栏中**（与其他按钮组合）

### 示例页面
- `/` - 主页展示独立使用
- `/paper-entry-demo` - 完整的使用演示
- `/settings` - TopBar 中使用

## PaperCollection 组件

### 介绍
PaperCollection 是一个"纸条盒"按钮组件，用于访问纸条盒查看已有纸条，可以在页面中任意位置使用。

### 特性
- 默认跳转到 `/notes` 页面
- 支持自定义点击事件
- 支持自定义样式
- 使用 Folder 图标
- 黑色圆角按钮样式

### 使用方法

#### 基础用法
```tsx
import PaperCollection from '@/components/ui/PaperCollection';

// 默认行为：点击跳转到 /notes
<PaperCollection />
```

#### 自定义点击事件
```tsx
<PaperCollection
  onClick={() => {
    console.log('自定义点击事件');
    router.push('/custom-path');
  }}
/>
```

#### 自定义样式
```tsx
<PaperCollection
  className="transform scale-110 shadow-lg"
/>
```

### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `className` | `string` | `undefined` | 自定义 CSS 类名 |
| `onClick` | `() => void` | `undefined` | 自定义点击事件，未提供时默认跳转到 `/notes` |

### 与 PaperEntry 的区别

| 组件 | 用途 | 默认跳转 | 图标 | 颜色 |
|------|------|---------|------|------|
| PaperEntry | 创建新纸条 | `/notes/new` | 编辑图标 | 黑色 |
| PaperCollection | 查看纸条盒 | `/notes` | 文件夹图标 | 黑色 |

### 使用场景

1. **页面任意位置**（独立使用）
2. **浮动按钮**（结合定位样式）
3. **工具栏中**（与其他按钮组合）
4. **与 PaperEntry 配合使用**

### 示例页面
- `/paper-collection-demo` - 完整的使用演示