/**
 * Created by rockyl on 2020-07-16.
 */

import React, {useState, useEffect} from 'react';
import {
	StyleSheet,
	FlatList,
	View,
	Text,
	TouchableOpacity,
} from 'react-native';

const EXPANDED = '__expanded';
const DEPTH = '__depth';
const INDEX_PATH = '__indexPath';

const Item = ({data, onPress, onPressArrow, renderItem, itemStyle, arrowRight, arrowDown, indentDistance = 15}) => {
	const {item, item: {children, __depth = 0, __expanded}} = data;
	return (
		<TouchableOpacity activeOpacity={0.8} style={[styles.treeItem, itemStyle, {marginLeft: __depth * indentDistance}]}
		                  onPress={() => onPress && onPress(item, data)}>
			<TouchableOpacity activeOpacity={0.8} style={styles.arrowWrapper}
			                  onPress={() => onPressArrow && onPressArrow(data)}>
				{children && children.length > 0 ? (
					__expanded ? (arrowDown || <Text>{'-'}</Text>) : (arrowRight || <Text>{'+'}</Text>)
				) : null}
			</TouchableOpacity>
			{renderItem ? renderItem(item, data) : <View/>}
		</TouchableOpacity>
	)
};

const _listEmptyView = ({text = 'Empty'}) => {
	return (
		<View style={styles.emptyWrapper}>
			<Text>{text}</Text>
		</View>
	);
};

export default ({data, style, onPressItem, renderItem, itemStyle, arrowRight, arrowDown, listEmptyView, indentDistance}) => {
	const [treeData, setTreeData] = useState([]);

	useEffect(() => {
		if (data) {
			for (let i = 0, li = data.length; i < li; i++) {
				const child = data[i];

				delete child[EXPANDED];
				Object.defineProperty(child, DEPTH, {
					get() {
						return 0;
					},
					configurable: true,
					enumerable: false,
				});
				Object.defineProperty(child, INDEX_PATH, {
					get() {
						return i.toString();
					},
					configurable: true,
					enumerable: false,
				});
			}

			setTreeData(data.concat());
		}
	}, []);

	function onPressArrow({index, item}) {
		if (item.children && item.children.length > 0) {
			let expended = item.hasOwnProperty(EXPANDED) && item[EXPANDED];

			for (let i = 0, li = item.children.length; i < li; i++) {
				const child = item.children[i];
				delete child[EXPANDED];
				Object.defineProperty(child, DEPTH, {
					get() {
						return (item[DEPTH] || 0) + 1;
					},
					configurable: true,
					enumerable: false,
				});
				Object.defineProperty(child, INDEX_PATH, {
					get() {
						return (item[INDEX_PATH] || '0') + '/' + i;
					},
					configurable: true,
					enumerable: false,
				});
			}

			let newTreeData = treeData.concat();
			if (expended) {
				let deleteCount;
				for (let i = index + 1; i < treeData.length; i++) {
					let child = treeData[i];
					if (!child[INDEX_PATH].startsWith(item[INDEX_PATH])) {
						deleteCount = i - index - 1;
						break;
					}
				}
				if (deleteCount === undefined) {
					deleteCount = treeData.length - index - 1;
				}
				newTreeData.splice(index + 1, deleteCount);
			} else {
				newTreeData.splice(index + 1, 0, ...item.children);
			}
			setTreeData(newTreeData);
			Object.defineProperty(item, EXPANDED, {
				get() {
					return !expended;
				},
				configurable: true,
				enumerable: false,
			})
		}
	}

	const _renderItem = (data) => (
		<Item data={data}
		      onPress={onPressItem}
		      onPressArrow={onPressArrow}
		      renderItem={renderItem}
		      itemStyle={itemStyle}
		      arrowRight={arrowRight}
		      arrowDown={arrowDown}
		      indentDistance={indentDistance}
		/>
	);

	return (
		<View style={[style]}>
			<FlatList data={treeData}
			          contentContainerStyle={treeData.length > 0 ? {} : {width: '100%', height: '100%'}}
			          renderItem={_renderItem}
			          keyExtractor={item => item.hasOwnProperty(INDEX_PATH) ? item[INDEX_PATH] : item}
			          ListEmptyComponent={listEmptyView || _listEmptyView}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	treeItem: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	arrowWrapper: {
		width: 14,
		justifyContent: 'center',
		alignItems: 'center',
	},
	emptyWrapper: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
