<template>
	<view>
		<swiper-action :list="list">
			<template #content>
				<view>asdasdasdsad</view>
			</template>
			<template #action>
				<view class="wrapper">
					<button>编辑</button>
					<button>删除</button>
				</view>
			</template>
		</swiper-action>
	</view>
</template>

<script>
	import swiperAction from '../../components/swiperAction'
	export default {
		components: {
			swiperAction
		},
		data() {
			return {
				list: [{
          xmove: 0,
          content: '内容区域1',
          id: 'a',
        }, {
          xmove: 0,
          content: '内容区域2',
          id: 'b',
        }, {
          xmove: 0,
          content: '内容区域3',
          id: 'c',
        } ],
			}
		},
		methods: {

		}
	}
</script>

<style>

</style>
