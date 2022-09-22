<script type="ts">
	import camera from '../store/camera';
</script>

<div class="wrapper">
	{JSON.stringify($camera, null, 2)}
</div>

<style>
	.wrapper {
		/* font-size: 48px; */
		text-align: center;
		line-height: 2;
		font-weight: bold;
		white-space: pre;
	}
</style>
