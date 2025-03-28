<script lang="ts">
	import { Users, Trophy, Calendar, BarChart3, Bell, Settings, LogOut, Home, ChevronDown, Search } from 'lucide-svelte';
  
	let isMobileMenuOpen = false;
	let isProfileDropdownOpen = false;
	let isSearchOpen = false;
	
	const stats = [
	  { label: 'Total Players', value: '2,847', change: '+12.5%' },
	  { label: 'Active Events', value: '24', change: '+4.3%' },
	  { label: 'Tournament Players', value: '1,249', change: '+8.1%' },
	  { label: 'Average Session', value: '2.4h', change: '+15.3%' }
	];
  
	const navigationItems = [
	  { icon: Home, label: 'Dashboard', href: '/' },
	  { icon: Users, label: 'Player Management', href: '/stats' },
	  { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
	  { icon: Calendar, label: 'Event Manager', href: '/events' },
	];
  
	const userProfile = {
	  name: 'Game Admin',
	  email: 'admin@gamemanager.com',
	  avatar: 'https://imgur.com/a/k0Enr4e'
	};
  </script>
  
  <div class="min-h-screen bg-gray-50">
	<!-- Top Navigation -->
	<header class="bg-white shadow-sm lg:fixed lg:w-full lg:top-0 lg:z-50">
	  <div class="flex items-center justify-between px-4 py-4 border-b border-gray-200 sm:px-6 lg:px-8">
		<div class="flex items-center flex-1">
		  <!-- svelte-ignore a11y_consider_explicit_label -->
		  <button
			class="text-gray-500 hover:text-gray-600 lg:hidden"
			on:click={() => isMobileMenuOpen = !isMobileMenuOpen}
		  >
			<svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
			</svg>
		  </button>
		  <div class="ml-4 lg:ml-0">
			<h1 class="text-2xl font-bold text-indigo-600">Game Manager</h1>
		  </div>
		</div>
  
		<!-- Search -->
		<div class="flex-1 hidden lg:flex items-center justify-center px-6">
		  <div class="w-full max-w-lg">
			<label for="search" class="sr-only">Search</label>
			<div class="relative">
			  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<Search class="h-5 w-5 text-gray-400" />
			  </div>
			  <input
				id="search"
				name="search"
				class="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				placeholder="Search players, events..."
				type="search"
			  />
			</div>
		  </div>
		</div>
  
		<div class="flex items-center gap-4">
		  <button class="text-gray-500 hover:text-gray-600">
			<Bell size={20} />
		  </button>
		  
		  <!-- Profile dropdown -->
		  <div class="relative">
			<button
			  class="flex items-center gap-2"
			  on:click={() => isProfileDropdownOpen = !isProfileDropdownOpen}
			>
			  <img
				class="h-8 w-8 rounded-full"
				src={userProfile.avatar}
				alt=""
			  />
			  <span class="hidden lg:flex items-center gap-2">
				<span class="text-sm font-semibold text-gray-900">{userProfile.name}</span>
				<ChevronDown size={16} class="text-gray-500" />
			  </span>
			</button>
  
			{#if isProfileDropdownOpen}
			  <!-- svelte-ignore a11y_no_static_element_interactions -->
			  <!-- svelte-ignore a11y_click_events_have_key_events -->
			  <div
				class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
				on:click={() => isProfileDropdownOpen = false}
			  >
				<a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
				<a href="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
				<a href="/logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
			  </div>
			{/if}
		  </div>
		</div>
	  </div>
	</header>
  
	<div class="flex">
	  <!-- Sidebar -->
	  <aside class="fixed inset-y-0 left-0 hidden lg:flex lg:w-64 lg:flex-col">
		<div class="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pt-20 pb-4">
		  <nav class="flex flex-1 flex-col">
			<ul role="list" class="flex flex-1 flex-col gap-y-7">
			  <li>
				<ul role="list" class="-mx-2 space-y-1">
				  {#each navigationItems as item}
					<li>
					  <a
						href={item.href}
						class="flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-white hover:bg-indigo-700"
					  >
						<svelte:component this={item.icon} size={20} />
						{item.label}
					  </a>
					</li>
				  {/each}
				</ul>
			  </li>
			  <li class="mt-auto">
				<a
				  href="/settings"
				  class="flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-white hover:bg-indigo-700"
				>
				  <Settings size={20} />
				  Settings
				</a>
			  </li>
			</ul>
		  </nav>
		</div>
	  </aside>
  
	  <!-- Main Content -->
	  <main class="lg:pl-64 pt-16">
		<div class="px-4 sm:px-6 lg:px-8 py-6">
		  <!-- Stats Grid -->
		  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			{#each stats as stat}
			  <div class="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6">
				<h3 class="text-sm font-medium text-gray-500">{stat.label}</h3>
				<div class="mt-2 flex items-baseline">
				  <p class="text-2xl font-semibold text-gray-900">{stat.value}</p>
				  <p class="ml-2 flex items-baseline text-sm font-semibold text-green-600">
					{stat.change}
				  </p>
				</div>
			  </div>
			{/each}
		  </div>
  
		  <!-- Recent Activity -->
		  <div class="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6">
			<div class="flex items-center justify-between mb-6">
			  <h2 class="text-base font-semibold text-gray-900">Recent Activity</h2>
			  <BarChart3 class="text-gray-400" size={20} />
			</div>
			<div class="space-y-4">
			  <div class="flex items-center justify-between py-3 border-b">
				<div>
				  <p class="text-sm font-medium text-gray-900">New Tournament Created</p>
				  <p class="text-sm text-gray-500">Summer Championship 2025</p>
				</div>
				<span class="text-sm text-gray-500">2 hours ago</span>
			  </div>
			  <div class="flex items-center justify-between py-3 border-b">
				<div>
				  <p class="text-sm font-medium text-gray-900">Player Milestone Achieved</p>
				  <p class="text-sm text-gray-500">Player "ProGamer123" reached Level 100</p>
				</div>
				<span class="text-sm text-gray-500">5 hours ago</span>
			  </div>
			  <div class="flex items-center justify-between py-3">
				<div>
				  <p class="text-sm font-medium text-gray-900">New Event Scheduled</p>
				  <p class="text-sm text-gray-500">Double XP Weekend</p>
				</div>
				<span class="text-sm text-gray-500">1 day ago</span>
			  </div>
			</div>
		  </div>
		</div>
	  </main>
	</div>
  
	<!-- Mobile Menu -->
	{#if isMobileMenuOpen}
	  <!-- svelte-ignore a11y_no_static_element_interactions -->
	  <div class="relative z-50 lg:hidden">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div class="fixed inset-0 bg-gray-900/80" on:click={() => isMobileMenuOpen = false}></div>
		<div class="fixed inset-0 flex">
		  <div class="relative mr-16 flex w-full max-w-xs flex-1">
			<div class="absolute left-full top-0 flex w-16 justify-center pt-5">
			  <button
				type="button"
				class="-m-2.5 p-2.5"
				on:click={() => isMobileMenuOpen = false}
			  >
				<span class="sr-only">Close sidebar</span>
				<svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
				  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			  </button>
			</div>
  
			<div class="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
			  <div class="flex h-16 shrink-0 items-center">
				<h1 class="text-2xl font-bold text-white">Game Manager</h1>
			  </div>
			  <nav class="flex flex-1 flex-col">
				<ul role="list" class="flex flex-1 flex-col gap-y-7">
				  <li>
					<ul role="list" class="-mx-2 space-y-1">
					  {#each navigationItems as item}
						<li>
						  <a
							href={item.href}
							class="flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-white hover:bg-indigo-700"
						  >
							<svelte:component this={item.icon} size={20} />
							{item.label}
						  </a>
						</li>
					  {/each}
					</ul>
				  </li>
				  <li class="mt-auto">
					<a
					  href="/settings"
					  class="flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-white hover:bg-indigo-700"
					>
					  <Settings size={20} />
					  Settings
					</a>
				  </li>
				</ul>
			  </nav>
			</div>
		  </div>
		</div>
	  </div>
	{/if}
  </div>