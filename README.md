# react-native-flat-tree
flat-tree for react native

# Install
`yarn add react-native-flat-tree`

# Shortcuts
![open](https://raw.githubusercontent.com/RockyF/react-native-flat-tree/master/assets/shortcut0.gif)

# Usage
```jsx harmony
import FlatTree from 'react-native-flat-tree'
import Icon from "react-native-vector-icons/FontAwesome";
...
const treeData = [
	{
		name: 'root0', uuid: '0', children: [
			{name: 'child0', uuid: '00'},
			{
				name: 'child1', uuid: '010', children: []
			},
			{
				name: 'child2', uuid: '011', children: [
					{name: 'child20', uuid: '0110'},
					{name: 'child20', uuid: '0111'},
					{name: 'child20', uuid: '0112'},
				]
			},
		],
	},
	{
		name: 'root1', uuid: '1',
	},
];
for (let i = 0; i < 100; i++) {
	treeData[0].children[1].children.push({name: 'child1' + i, uuid: '0100_' + i},)
}

const listEmptyView = ({text = 'No Items'}) => {
	return (
		<View style={styles.emptyWrapper}>
			<Text style={styles.emptyText}>{text}</Text>
		</View>
	);
};

export default () => {
	return (
		<FlatTree data={treeData} itemStyle={styles.itemStyle}  style={styles.container}
		          renderItem={item => <Text style={{color: COLOR.textPrimary}}>{item.name}</Text>}
		          arrowRight={<Icon name="caret-right" color={COLOR.textPrimary}/>}
		          arrowDown={<Icon name="caret-down" color={COLOR.textPrimary}/>}
		          onPressItem={item => console.log(item.name)}
		          listEmptyView={listEmptyView}
		/>
	);
}
...
```

# Props
| prop | type | required | default |
| ---- | ---- | ----     | ----    |
| data | Array | true |  |
| style | any | false |  |
| onPressItem | (item)=>void | false |  |
| renderItem | react-node | true |  |
| filter | (item, index, data)=>boolean | false |  |
| itemStyle | any | false |  |
| arrowRight | react-node | false | + |
| arrowDown | react-node | false | - |
| listEmptyView | react-node | false | builtin |
| indentDistance | number | false | 15 |
| childrenField | string | false | 'children' |
