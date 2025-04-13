<script lang="ts">
	import { Toaster } from "$lib/components/ui/sonner";
	import "../app.css";
	import { ModeWatcher } from "mode-watcher";

	let { children } = $props();
</script>

<Toaster richColors toastOptions={{ class: "font-sans" }} />
<ModeWatcher />
{@render children()}
