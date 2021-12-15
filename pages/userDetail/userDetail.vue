<template>
	<view>
		<view class="head">
			<image @click="showPopup=true" :src="userInfo.headImg" alt="" />
		</view>
		<view class="item username">昵称: {{ userInfo.username }}</view>
		<view class="item sex">性别: {{ userInfo.sex }}</view>
		<view class="item sex">年龄: {{ userInfo.age }}</view>
		<view class="item desc">描述: {{ userInfo.desc }}</view>
		<button @click="showIpts" v-show="showBtn" size="mini" round>修改资料</button>
		<button class="logout" v-show="showBtn" type="warn" @click="logout">退出登录</button>
		<view class="ipts" v-if="show">
			<input v-model="body.sex" placeholder="性别" type="text" />
			<input v-model="body.age" placeholder="年龄" type="text" />
			<textarea v-model="body.desc" placeholder="描述"></textarea>
			<button class="submit" @click="changeInfo">提交</button>
		</view>
		<u-popup :show="showPopup" @close="close" @open="open">
			<view class="upload">
				<u-upload :fileList="fileList" @afterRead="afterRead" @delete="deletePic" name="1" multiple
					:maxCount="1">
					<image src="../../static/image/upload.png" mode=""></image>
				</u-upload>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
				flag: '',
				showBtns: false,
				userInfo: {},
				show: false,
				body: {
					sex: "",
					age: "",
					desc: "",
					username: "",
				},
				showPopup: false,
				fileList: []
			}
		},
		onLoad(option) {
			this.id = option.id
			this.flag = option.flag
			this.getUserDetail()
			// this.$http({
			// 	url: '/userDetail/' + option.id
			// }).then(res => {
			// 	this.userInfo = res.data;
			// 	this.body.username = res.data.username;
			// }).catch(err => {
			// 	console.log(err)
			// })
		},
		computed: {
			showBtn() {
				// if(this.flag){
				// 	return true
				// }else{
				// 	return false
				// }
				let that = this
				uni.getStorage({
					key: "userId",
					success: function(res) {
						if (res.data == that.id) {
							that.showBtns = true
						} else {
							that.showBtns = false
						}
					}
				})
				return that.showBtns
			}
		},
		methods: {
			getUserDetail() {
				let that = this
				that.$http({
					url: '/userDetail/' + that.id
				}).then(res => {
					that.userInfo = res.data;
					this.body.username = res.data.username;
				}).catch(err => {
					console.log(err)
				})
			},
			showIpts() {
				this.show = true
			},
			changeInfo() {
				let that = this
				this.show = false;
				this.$http({
					url: '/userDetail',
					method: 'POST',
					data: this.body
				}).then(res => {
					// 后台不终止（res.end()）不会执行then回调
					that.getUserDetail()
				}).catch(err => {
					console.log(err)
				})
			},
			logout() {
				uni.removeStorage({
					key: 'userId',
					success: function() {
						uni.navigateTo({
							url: '../index/index'
						})
					}
				})
			},
			afterRead(file) {
				let name = this.userInfo.username
				let that = this
				uni.uploadFile({
					url: 'http://localhost:3000/uploadAvator',
					filePath: file.file[0].url,
					name: 'file',
					formData: {
						username: name
					},
					header: {
						'Content-Type': 'multipart/form-data'
					},
					success: (res) => {
						that.showPopup = false
						that.getUserDetail()
					}
				})
			}
		}
	}
</script>

<style>
	.head {
		display: flex;
		padding: 10px;
		margin: 20px 0;
		justify-content: space-around;
	}

	image {
		width: 70px;
		height: 70px;
		border-radius: 50%;
	}

	.user-detail {
		position: relative;
	}

	.upload {
		padding: 10px 0;
	}

	.upload image {
	margin-left: 130px;
	}

	.user-detail view:nth-child(1) {
		position: fixed;
		top: 10px;
		left: 10px;
	}

	.item {
		margin: 15px 0 15px 15px;
		color: rgb(116, 116, 116);
	}

	.user-detail button {
		position: absolute;
		left: 50%;
		margin-top: 20px;
		transform: translateX(-50%);
	}

	.ipts {
		display: flex;
		flex-direction: column;
		position: absolute;
		width: 80%;
		top: 50%;
		left: 50%;
		box-shadow: 3px 3px 2px rgba(0, 0, 0, 0.3);
		justify-content: space-around;
		transform: translate(-50%, -50%);
		padding: 10px;

		background-color: #f2f2f2;
	}

	input {
		margin: 10px 0;
		padding: 2px;
		border: 1px solid #00aaff;
		width: 40%;
		height: 20px;
		border-radius: 10px;
	}

	textarea {
		border: 1px solid #00aaff;
		width: 80%;
		height: 50px;
		resize: none;
		margin: 10px 0;
	}

	.submit {
		margin: 10px 0;
		width: 20%;
		height: 30px;
		font-size: 12px;
		line-height: 20px;
		box-shadow: 1px 1px 2px rgba(0, 0, 0, .3);
		position: absolute;
		left: 70%;
		top: 20%;
		padding: 3px;
		background-color: rgb(183, 183, 255);
		border-radius: 10px;
		border: 1px solid #ccc;
	}

	button {
		margin: 0 auto;
	}
</style>
