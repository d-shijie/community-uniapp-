<template>
	<view class="profile">
		<view @click="gotoUserDetail" class="top">
		      <view class="headImg">
		        <image :src="userData.headImg" alt="" />
		      </view>
		      <view class="username">
		        {{ userData.username }}
		      </view>
		      <view class="sex">
		        <image
		          v-if="userData.sex === '女'"
		          src="../../static/image/woman.svg"
		          alt=""
		        />
		        <image
		          v-if="userData.sex === '男'"
		          src="../../static/image/man.svg"
		          alt=""
		        />
		      </view>
			  <u-icon class="right" name="arrow-right">	</u-icon>
		    </view>
		    <header>我的动态</header>
		    <event-list @success='success' :show='true' :events="events"></event-list>
	</view>
</template>

<script>
	import EventList from 'pages/eventList/eventList'
	export default {
		data() {
			return {
				 userData: {},
				      events: [],
			}
		},
		onLoad() {
			let userId;
			let that=this
			uni.getStorage({
				key:'userId',
				success:function(res){
					userId=res.data
					that.$http({url:'/userDetail/'+userId}).then(res=>{
						that.userData = res.data;
					}).catch(err=>{
						console.log(err)
					})
					that.$http({url:'/userEvents',data:{id:userId}}).then(res=>{
						 that.events = res.data.rows.reverse();
					}).catch(err=>{
						console.log(err)
					})
				}
			})
		},
		components:{
			EventList
		},
		methods: {
			gotoUserDetail(){
				uni.navigateTo({
					url:'../userDetail/userDetail?id='+this.userData.userid+'&flag=0'
				})
			},
			success(){
				let userId;
				let that=this
				uni.getStorage({
					key:'userId',
					success:function(res){
						userId=res.data
						that.$http({url:'/userDetail/'+userId}).then(res=>{
							that.userData = res.data;
						}).catch(err=>{
							console.log(err)
						})
						that.$http({url:'/userEvents',data:{id:userId}}).then(res=>{
							 that.events = res.data.rows.reverse();
						}).catch(err=>{
							console.log(err)
						})
					}
				})
			}
		}
	}
</script>

<style>
.profile {
  background-color: #f2f2f2;
  width: 100%;
  /* height: 100%; */
}
.top {
  background-color: #fff;
  position: relative;
  padding: 10px;
  display: flex;
  height: 80px;
  align-items: center;
}
.headImg {
  width: 70px;
  height: 70px;
}
.headImg image {
  width: 100%;
  border-radius: 50%;
  height: 100%;
}
.username {
  font-size: 15px;
  font-weight: 600;
  margin-left: 10px;
}
.sex image {
  width: 12px;
  margin-left: 3px;
}
.u-icon {
  position: absolute;
  right: 10px;
}
header {
  margin: 10px 0 5px 10px;
  font-size: 14px;
  color: rgb(108, 108, 255);
}
</style>
