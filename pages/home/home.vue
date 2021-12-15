<template>
	<view class="home">
		<view class="search">
			<input v-model="keywords"  type="text" value="" placeholder="搜索"/>
			<button @click="search" size="mini" type="default">搜索</button>
			<button @click="gotoPublish" size="mini" type="warn">发布</button>
		</view>
		<view class="tags">
			<button :class="{active:currentIndex===index}" @click="tagClick(item.category,index)" type="default" v-for="(item,index) in tags">
				{{item.label}}
			</button>
		</view>
		<event-list :events='events'></event-list>
	</view>
</template>

<script>
	import EventList from 'pages/eventList/eventList'
	export default {
		data() {
			return {
				tags:[
					 { label: "全部", category: -1 },
					 { label: "推荐", category: 0 },
					 { label: "生活", category: 1 },
					 { label: "政治", category: 2 },
					 { label: "娱乐", category: 3 },
				],
				events:[],
				currentIndex:0,
				keywords:''
			}
		},
		components:{
			EventList
		},
		onShow() {
			this.$http({url:'/events/-1/1'}).then(res=>{
				this.events=res.data.data.rows.reverse()
			}).catch(err=>{
				console.log(err)
			})
		},
		methods: {
			tagClick(category,index){
				this.currentIndex=index
				this.$http({url:'/events/'+category+'/1'}).then(res=>{
					console.log(res)
					this.events=res.data.data.rows.reverse()
				}).catch(err=>{
					console.log(err)
				})
			},
			search(){
				this.$http({url:'/search/'+this.keywords}).then(res=>{
					console.log(res)
					this.events=res.data.rows.reverse()
				}).catch(err=>{
					console.log(err)
				})
			},
			gotoPublish(){
				uni.navigateTo({
					url:'../publish/publish'
				})
			}
		}
	}
</script>

<style lang="scss">
.home {
	background-color: #f2f2f2;
	.search {
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 10px;
		input {
			// width: 65%;
			border-radius: 10px;
			font-size: 12px;
			flex: 1;
			border: 1px solid #00aaff;
		}
		button{
			margin: 0 5px;
		}
	}
	.tags {
		display: flex;
		padding: 10px 0;
		button {
			font-size: 12px;
			border-radius: 10px;
			width: 15%;
			text-align: center;
			height: 30px;
		}
	}
	.active {
		background-color: #00aaff;
		font-weight: 600;
	}
}
</style>
