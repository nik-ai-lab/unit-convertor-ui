<script>
  import Header from './lib/components/Header.svelte';
  import Footer from './lib/components/Footer.svelte';
  import CategoryTabs from './lib/components/CategoryTabs.svelte';
  import ConverterCard from './lib/components/ConverterCard.svelte';
  import TemperatureScale from './lib/components/TemperatureScale.svelte';
  import PresetButtons from './lib/components/PresetButtons.svelte';
  import HistoryLog from './lib/components/HistoryLog.svelte';
  import SettingsModal from './lib/components/SettingsModal.svelte';
</script>

<div class="app-wrapper">
  <Header />

  <main class="main-content">
    <div class="container">
      <CategoryTabs />
      <ConverterCard />
      <TemperatureScale />
      <PresetButtons />
      <HistoryLog />
    </div>
  </main>

  <Footer />
  <SettingsModal />
</div>

<style>
  .app-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    padding: 2rem 0;
  }
</style>
