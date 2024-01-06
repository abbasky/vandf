## Vandf



### 1.总体功能描述

​	采用主流的javascript语言进行开发，兼容chorme、firefox等主流浏览器。

​	Vandf框架(The vanilla javascript data framework)，由原来的D3C开关框架演变而来，采用数据驱动的底层架构，数据可以自由的将组件渲染为浏览器DOM元素构成的界面。该框架对数据没有任何约束，即不规定数据的特定结构。同一组件可以用不同结构的数据进行驱动。

​	组件定义方式简单便捷，符合直觉，成型组件的任意组成部分仍可根据使用者的需要方便的修改。

该框架可以方便的与纯css框架配合构建现代化的响应式组件，例如可以和tailwind css框架和bulma css框架进行配合。

​	该组件也可以与d3.js数据驱动的图形库进行很好的配合，可以有效降低d3.js使用的难度，使得更容易构建出用户需要的图表应用。

​	通过该框架定义的组件，可以通过任意组合来轻松的实现整个用户界面的构建。

Vandf框架具有如下特点：

- 易学易用

​	将HMTL的DOM模型的复杂性隔离起来，开发者不需要面对复杂的DOM元素操作，只需要关心业务数据本身和视图展示的数据需求，心智负担大大减小。

- 性能出色

​	框架只更新数据变更的DOM元素，完全响应式的渲染系统，几乎不需要手动优化，框架未采用虚拟DOM架构，没有虚拟DOM 差异比对方面的性能消耗，可以达到非常高的渲染效率。

- 灵活多变

  框架可以在数据构建模型时按需配置界面的显示样式生成，也可以在DOM元素创建和渲染过程中，根据不同数据和状态构建外观，提供了灵活多变的自由度。

- 精细操控
  组件中的任意部件都可以进行精细控制，在保证组件的独立完整性的基础上，仍提供了组件各个部分精细操作的通道。

### 2.认识Vandf

​	Vandf是一款用于构建用户界面的 JavaScript 框架。它基于标准 HTML、CSS 和 JavaScript 构建，并提供了一套声明式的、组件化的数据驱动的编程模型，帮助你高效地开发用户界面。无论是简单还是复杂的界面，Vandf 都可以胜任。示例展示了Vandf申明式组件定义、响应式视图模型、用户数据模型三个核心功能。

- 声明式组件定义

​	Vandf组件定义采用了申明式定义方式，通过定义标签tag，样式style，属性attrs，类classes等，使得我们可以简明地描述最终输出的 HTML层次关系和展现的样式。组件定义时可以绑定视图模型和数据模型，还可以通过data(items)方法初始化数据，下例中提供了三个数据，Vandf会自动创建3个计数器按钮。如下图所示：

![image-20240103222810499](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20240103222810499.png)

- 组件定义

```javascript
let app = Van.new('app')
    
Van.new('counter', app.id)
    .tag('button')
    .view(CounterView)
    .model(CounterModel)
    .data([0,10,20])

app.attach(document.querySelector('#app'));
```

- 用户数据模型


​	用户数据模型可以通过构造函数获取组件定义阶段的初始化数据，也可以通过data(parentDatum)方法获取父组件的数据，data()方法返回一个数组，Vandf会构建与数组个数一样多的组件单元。当未定义数据模型或data()方法时，Vandf会自动将父组件的数据（datum）原封不动的向子组件传递。

``````javascript
class CounterModel {
    constructor(data){
        this.count = data;
    }

    data () {return this.count}

    add(index){ this.count[index] = this.count[index] + 1 }
}
``````

- 视图模型

​	Vandf视图模型可以应以组件创建（create）、渲染（render）、释放（destroy）、状态（states）方法，可以非常容易地构建响应式组件。视图模型可以在创建（create）阶段注册事件进行交互，在渲染（render）阶段根据数据和状态变化自动更新组件。可以通过states接收父级组件的状态，也可以向下传递本组件的状态变化。

```javascript
class CounterView {
    constructor (model) {
        this.model = model;
    }
    create (node,i) {
        node.on('click',(e)=>{
            this.model.add(i);
            node.update()
        },'native')
    }
    render (node, d) {
        node.text(`The count is : ${d}`)
    }
}
```



### 3.组件定义

​	通过外部配置实现对组件结构、样式、属性、数据等的初始值进行定义，并可以通过绑定组件视图、用户数据模型，方便的实现数据驱动的响应式组件的构建。

```javascript
Dao.new("label")
        .tag("button")
        .classes("button-label no-selected")
        .styles({
            background: 'white',
            color: 'red',
            'margin-left': '5px'
        })
        .attrs({value:"1234"})
        .html("<b>Label</b>")
```

#### 组件属性

| 属性名称 | 属性功能         | 说明                                 |
| -------- | ---------------- | ------------------------------------ |
| kids     | 子组件数组       |                                      |
| name     | 组件名称         |                                      |
| id       | 组件id           | 组件id实质是一个包含名称的路径字符串 |
| views    | 所有注册的视图类 |                                      |

#### 组件方法

| 组件方法            | 方法功能                                                     | 说明                                         |
| ------------------- | ------------------------------------------------------------ | -------------------------------------------- |
| after (name)        | 在本组件后插入指定名称的兄弟组件                             | 用于修改第三方组件                           |
| append (kid)        | 添加子组件kid                                                | kid是Van的实例                               |
| attach (element)    | 将组件挂载到HTML Element下                                   | 组织挂载之后才可以实例化。                   |
| before (name)       | 在本组件前插入指定名称的兄弟组件                             | 用于修改第三方组件                           |
| data (initdata)     | 用于初始化组件数据或传递外部数据提供方法                     | intdata传递给模型的构造函数                  |
| get (name)          | 按名称获取子组件                                             |                                              |
| index(idString)     | 获取组件id为idString的子组件的索引                           |                                              |
| insert (kid, index) | 在index位置插入子组件kid                                     | kid是Van的实例                               |
| kid(name)           | 创建并添加名称为name的子组件                                 |                                              |
| model (model)       | 设置或返回模型，无model参数时，返回模型。                    | 模型始终只有一个实例。参见model模型章节。    |
| parent (level = 1)  | 获取指定层级的父组件                                         | 层级level=2表示获取向上第2级父组件           |
| tag (tagName)       | 指定Html的tag名称，默认‘div’，支持svg各类tag名称。           | 例： ‘button’，‘span’，‘p’，‘input’，‘svg'等 |
| attrs(config)       | 设置属性，参数config为对象                                   | 例：comp.attrs（{'name':'China'}）           |
| classes(names)      | 设置类型名称                                                 | 例：comp.classes("label left-bar")           |
| html (text)         | 设置html内容                                                 | 例：comp.html(<b>Label</b>)                  |
| states(initStates)  | 设置初始状态                                                 | 例：comp.states({size:100})                  |
| styles(config)      | 设置样式，参数config为对象                                   | 例：comp.styles（{'color':'red'}）           |
| view (view)         | 设置view类，view可以设置多个，对于第三方组件的使用和扩展特别有用。 | 例：comp.view(class CompView {})             |



### 4.组件封装

​	通过配置方式定义一个带标签的按钮，表达式清晰明确，label和button在html中的排列顺序就是定义的顺序，非常符合直觉的声明式。也可以如下方式对组件进行封装以便于重用。

```javascript
class MyButton extends Dao {
    constructor(id) {
        super(id)

        this.kid('label').tag('span').html('Button')
        this.kid('button').tag('button')
    }
}
```



### 5.组件视图模型

​	组件视图模型用于注册响应事件、渲染组件、管理状态。组件视图允许多个视图组件渲染阶段也可以对内容、样式进行设置，响应数据和状态的变化。组件渲染阶段还可以通过node读取到元素位置、焦点、大小等元素的属性。

| 视图模型支持的方法           | 方法的功能                                                   | 说明                                                         |
| ---------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| construct(model, initStates) | 视图模型的构造函数，可以传入数据模型，和初始化状态。         |                                                              |
| data(parentDatum)            | 1.接收父组件的数据；2.返回组件的数据                         | 返回数据可以是任意数据，当返回非空数组时，则按照数组长度创建组件个数，空数组则不创建组件，其余情况则创建1个组件。 |
| create(node, index)          | 主要用于注册事件，响应事件，对数据模型进行操作。             | 创建组件时调用create方法，该方法仅调用1次。                  |
| destroy(node, index)         | 组件移除前释放资源，一般可以用于移除事件。                   | 组件移除前调用destroy方法，该方法仅调用1次。                 |
| render(node, datum, index)   | 组件渲染时对样式、类、属性、文本等进行计算，配置等。         | 组件创建后以及每次更新时均调用该方法。                       |
| states(parentStates)         | 1.接收父组件的状态或上述一视图的状态；2.返回本视图模型的状态。 | 在组件每次渲染前调用该方法进行状态更新。视图状态通过传递实现状态共享，通过重新组装状态实现状态的隔离。 |

视图模型中的node是Node的实例，不要与HTML中的Node相混淆。Node的属性和API方法如下：

| Node的属性名称 | Node属性功能                                     | 说明 |
| -------------- | ------------------------------------------------ | ---- |
| componentId    | 组件id                                           |      |
| datum          | 组件数据                                         |      |
| document       | 获取html dom的document                           |      |
| first          | 获取第一个兄弟Node实例                           |      |
| model          | 获取model的实例                                  |      |
| name           | 获取组件名称                                     |      |
| holder         | 获取有兄弟的父节点实例                           |      |
| id             | 获取Node实例的id                                 |      |
| index          | 获取组件在兄弟Node实例中的索引。                 |      |
| last           | 获取最后一个兄弟Node实例                         |      |
| proxy          | 获取Node实例的事件代理                           |      |
| serial         | 获取holder的索引，即获取具有兄弟的父组件的索引。 |      |
| sibline        | 获取本实例和兄弟实例的容器                       |      |
| tag            | 获取element的tag名称。                           |      |

| Node的方法                                | Node方法的功能                                               | 说明               |
| ----------------------------------------- | ------------------------------------------------------------ | ------------------ |
| addEventListener(type, listener, options) | 注册document的事件监听器                                     |                    |
| attr(key, value)                          | 设置element的属性，value可以是值或函数。                     |                    |
| blur()                                    | 设置失去焦点状态，需要调用node.update()后生效。              |                    |
| classed(name, value)                      | 设置element的类，value可以是值（true/false）或函数。         |                    |
| emit(eventType, data)                     | 派发事件，data为通过事件携带的数据，可以是任意类型           |                    |
| empty()                                   | 判断node中的element是否为空。                                |                    |
| focus()                                   | 设置焦点状态。                                               |                    |
| html(value)                               | 设置element的html内容，value可以是值或函数。                 |                    |
| on(type, listener, options)               | 注册node事件，其中options为true或非空时，则注册为原生事件监听，既dom的传统事件。 | 详见事件部分的内容 |
| parent(level = 1)                         | 获取指定层级的父Node                                         |                    |
| style(key, value, priority)               | 设置或获取element的html样式，value可以是值或函数。           |                    |
| text(value)                               | 设置或获取element的文本内容，value可以是值或函数。           |                    |
| toggle(name)                              | 触发设置或取消element指定的类                                |                    |
| update()                                  | 刷新组件，数据或状态变更后调用该函数，重新渲染组件。         |                    |
| value(value)                              | 设置或获取value属性值                                        |                    |

attr、blur、focus、classed、style、text、html方法设置数据或状态后，均需要显示调用node.update()才能更新视图。

### 6.组件数据模型

​	组件数据模型用于提供、传递、转换、操作数据等工作，数据模型使用非常自由宽松，对用户约束极少，但与view模型配合，能够轻松的完成各种复杂的任务。

| 数据模型的方法                    | 方法的功能                                                   | 说明 |
| --------------------------------- | ------------------------------------------------------------ | ---- |
| constructor(initdata,parentModel) | 构造函数，initdata：组件初始化数据，parentModel：父数据模型。 |      |
| data(parentDatum,parentStates)    | 提供、传递、转换数据，parentDatum是父组件实例的数据,parentStates为父组件的状态，也可认为是共享状态。 |      |



### 7.重复组件

​	Repeat组件可以非常方便的定义反复重复的多层结构，根据数据的层次自动渲染出dom的层次结构。例如可以方便的渲染如下的结构：

![image-20240103221937619](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20240103221937619.png)

#### 1）定义组件层次

```javascript
let app = Van.new('app')

let ul = app.kid('ul').tag('ul').model(UlModel)
let li = ul.kid('li').tag('li')
li.kid('text').tag('span').view(TextView)

Repeat.new('ul', li.id)
    .Van(ul)
    .model(RepeatModel)

app.attach(document.querySelector('#app'))
```



#### 2)视图模型和数据模型

```javascript
class UlModel {
    data(){ return data }
}

class TextView {
    render (node, d) {
        node.text(d.name)
    }
}

class RepeatModel {
    data(d){
        return d?.children ? d.children : []
    }
}
```



#### 3)准备数据

```javascript
const data = [
    {
        name:"中国", 
        children:[
            {
                name:"江苏",
                children:[
                    {
                        name:"南京",
                        children:[
                            {name:"句容"},
                            {name:"丹阳"},
                        ]
                    },
                    {name:"扬州"},
                ]
            },
            {
                name:"湖北",
                children:[
                    {name:"武汉"},
                    {name:"黄石"},
                ]
            },
        ]
    }
]
```



### 8.事件模型

​	Vandf的事件模型包括原生事件(Raw Event)、节点事件(Node Event)、文档事件（Document Event），原生事件通过本地代理生转换成节点事件向组件传递信息。节点事件在按照组件层次逐级向上冒泡，将信息传递给父组件。文档事件（Document Event）仍以原生形态出现。

![image-20240101210638566](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20240101210638566.png)

### 9.与纯css库结合使用

​	本框架与tailwind css框架、bulma css框架天然契合，通过类名即可实现无缝衔接，通过控制class名称来控制渲染的样式，而Vandf可以通过classed来的数据和索引以及node的其它属性信息来灵活控制采用什么class应该被设置或被删除。具体操作参照“设置类名”章节。

### 10.与d3.js结合使用

​	d3.js是著名的数据驱动的图形库，具有功能强大，使用灵活的特点，但也存在学习曲线陡峭的问题，组件化难度大的特点。通过与Vandf框架的结合使用，可以降低使用难度，易于实现组件化。以下是一个水平树形的构建例子。

![image-20240102225609061](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20240102225609061.png)

- 引入库文件

```javascript
import Van from "../core/comp";
import * as d3 from "d3";
```



- 定义组件

```javascript
export default class HTree extends Van {
    constructor(id){
        super(id)

        const svg = this.kid('layer').tag('svg').view(SvgView).model(SvgModel)
        const tree = svg.kid('tree').tag('g').view(TreeView).model(TreeModel)
        tree.kid('link').tag('path').view(LinkView).model(LinkModel)
        const node = tree.kid('node').tag('g').view(NodeView).model(NodeModel)
        node.kid('circle').tag('circle').view(CircleView)
        node.kid('text').tag('text').view(TextView)
    }
}
```



- 定义SVG画布的视图和模型

```javascript
class SvgModel {
    data () {
        return  d3.hierarchy(data, (d) => d.children);
    }
}


class SvgView {
    constructor(_, config){
        this._states = config || {
            top: 20, right: 90, bottom: 30, left: 90,
            width: 660, height:500
        }
    }
    states(){
        return this._states
    }

    create (node) {
        let s = this._states;
        node.attr("width", s.width)
            .attr("height", s.height)
    }
}
```



- 定义Tree的视图和模型

```javascript
class TreeModel {
    data (d, s) {
        let height = s.height - s.top - s.bottom;
        let width = s.width - s.left - s.right;
        const treeMap = d3.tree().size([height, width]);        
        const tree =  treeMap(d);
        return {nodes:tree.descendants()}
    }
}

class TreeView {
    constructor(model){
        this.model = model
    }
    states (s) {
        this._config = s;
    }
    create (node) {
        let s = this._config;
        node.attr("transform", "translate(" + s.left + "," + s.top + ")");
    }
}
```



- 定义Link连线的视图和模型

```javascript
class LinkModel {
    data (d) {
         return d.nodes.slice(1);
    }
}

class LinkView {
    render (node) {
        node.attr("d", (d) => {
                let x = d.x, y = d.y, px = d.parent.x, py = d.parent.y;
                return `M${y},${x},C${(y+py)/2},${x} ${(y+py)/2},${px} ${py},${px}`
            })
            .style("stroke", (d) => d.data.level)
            .style('fill','none')
    }
}
```



- 定义Node节点的视图和模型

```javascript
class NodeModel {
    data (d) {
        return d.nodes;
    }
}

class NodeView {
    render (node) {
        node.attr(
            "class",
            (d) => "node" + (d.children ? " node--internal" : " node--leaf")
        )
        .attr("transform", (d) => `translate(${d.y},${d.x})`)
    }
}
```



- 定义Circle圆节点视图

```javascript
class CircleView {
    create (node) {
        node.on('click', e=>{
            console.log(node.datum)
        },true)
    }
    render (node) {
        node.attr("r", (d) => d.data.value)
            .style("stroke", (d) => d.data.type)
            .style("fill", (d) => d.data.level)
            .style('stroke-width','3px')
    }
}
```



- 定义节点文本Text视图

```javascript
class TextView {
    render (node) {
        node.attr("dy", ".35em")
            .attr("x", (d) => (d.children ? (d.data.value + 5) * -1 : d.data.value + 5))
            .attr("y", (d) => (d.children && d.depth !== 0 ? -(d.data.value + 5) : d.data.value-10))
            .style("text-anchor", (d) => (d.children ? "end" : "start"))
            .text((d) => d.data.name)
    }
}
```



- 使用HTree组件

```javascript
let app = Van.new('app')
    
HTree.new('htree',app.id)
    .model(HtreeModel)
    .states({
        top: 100, right: 90, bottom: 30, left: 90,
        width: 660, height:500
    })
    .data(data)

app.attach(document.querySelector('#app'));
```



- 准备HTree数据

```javascript
class HtreeModel {
    constructor(data){
        this._data = data;
    }

    data () {
        return this._data
    }
}

const data = {
    "name": "1",
    "value": 15,
    "type": "black",
    "level": "yellow",
    "children": [
        {
            "name": "1-2",
            "value": 10,
            "type": "grey",
            "level": "red"
        },
        {
            "name": "1-3",
            "value": 10,
            "type": "grey",
            "level": "red",
            "children": [
                {
                    "name": "1-3-001",
                    "value": 7.5,
                    "type": "grey",
                    "level": "purple"
                },
                {
                    "name": "1-3-002",
                    "value": 7.5,
                    "type": "grey",
                    "level": "purple"
                }
            ]
        },
        {
            "name": "1-4",
            "value": 10,
            "type": "grey",
            "level": "blue"
        },
        {
            "name": "1-5",
            "value": 10,
            "type": "grey",
            "level": "green",
            "children": [
                {
                    "name": "1-5-001",
                    "value": 7.5,
                    "type": "grey",
                    "level": "orange"
                },
                {
                    "name": "1-5-002",
                    "value": 7.5,
                    "type": "grey",
                    "level": "orange"
                }
            ]
        },
        {
            "name": "1-6",
            "value": 10,
            "type": "grey",
            "level": "blue",
            "children": [
                {
                    "name": "1-6-001",
                    "value": 7.5,
                    "type": "grey",
                    "level": "purple"
                },
                {
                    "name": "1-6-002",
                    "value": 7.5,
                    "type": "grey",
                    "level": "purple"
                }
            ]
        }
    ]
}
```



