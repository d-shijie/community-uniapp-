<template>
	<view>
		<form>
			<input v-model="title" class="title" placeholder="我是标题哦(⊙o⊙)" type="text" name="title" />
			<textarea v-model="content" placeholder="这里写内容！！！" type="text" name="content" />
			<uni-file-picker v-model="imageValue" fileMediatype="image" mode="grid" @select="select"
				@progress="progress" @success="success" @fail="fail" />
		</form>
		<view class="category">
			<u-picker @confirm='confirm' @cancel='show=false' :show="show" keyName="label" :columns="columns">
			</u-picker>
			<u-button @click="show = true">选择分类</u-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				content: '',
				show: false,
				imageValue: null,
				filePath: '',
				columns: [
					[{
							label: "推荐",
							value: 0,
						},
						{
							label: "生活",
							value: 1,
						},
						{
							label: "政治",
							value: 2,
						},
						{
							label: "娱乐",
							value: 3,
						},
					]
				],
			}
		},
		methods: {
			select(e) {
				this.filePath = e.tempFilePaths[0]
			},
			confirm(value) {
				if (this.title === '') {
					uni.showToast({
						title: '请为你的动态写个标题吧',
						icon: 'none',
						duration: 2000
					});
				} else if (this.content === '') {
					uni.showToast({
						title: '请为你的动态写点内容吧',
						icon: 'none',
						duration: 2000
					});
				} else {
					let userId;
					let that = this
					let category = value.value[0].value
					uni.getStorage({
						key: 'userId',
						success: function(res) {
							userId = res.data
							that.$http({
								url: '/userDetail/' + userId
							}).then(res => {
								let username = res.data.username;
								let data = {}
								// data.file = that.file
								data.name = username
								data.userId = userId
								data.title = that.title
								data.content = that.content
								data.category = category
								uni.uploadFile({
									url: 'http://localhost:3000/publish',
									filePath: that.filePath,
									name: 'file',
									formData: data,
									header: {
										'Content-Type': 'multipart/form-data'
									},
									success: res => {
										uni.switchTab({
											url: '../home/home'
										})
									},
								})
							})
						}
					});
				}

			}
		}
	}
</script>

<style>
	.top {
		margin: 5px 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.top span:nth-child(1) {
		width: 20px;
		font-size: 16px;
		text-align: center;
	}

	.top span:nth-child(3) {
		width: 40px;
		font-size: 14px;
		color: rgb(179, 179, 255);
		text-align: center;
	}

	.top span:nth-child(2) {
		flex: 1;
		font-size: 16px;
		text-align: center;
	}

	.allow {
		color: rgb(74, 74, 255) !important;
		font-weight: 600;
	}

	.title {
		width: 100%;
		padding: 10px 5px 10px 5px;
		margin: 10px 0 0 0;
		border: none;
		resize: none;
		border-bottom: 1px solid #ccc;
	}

	textarea {
		width: 100%;
		padding-bottom: 30px;
		padding-left: 5px;
		padding-top: 5px;
		margin: 0 0 px 0;
		border: none;
		resize: none;
		border-bottom: 1px solid #ccc;
	}

	.file {
		margin: 10px 0;
		border: none;
	}

	.el-select {
		margin: 10px 0 10px 10px;
		width: 35%;
	}

	.category {
		margin: 10px 0 10px 10px;
	}

	.cate {
		font-size: 14px;
	}
</style>
