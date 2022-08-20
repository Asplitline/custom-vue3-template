<template>
  <div class="container">
    <Breadcrumb />
    <a-row :gutter="20" align="stretch">
      <a-col :span="24">
        <a-card class="general-card" :title="$t('menu.list.cardList')">
          <a-row justify="space-between">
            <a-col :span="24">
              <a-tabs :default-active-tab="1" type="rounded">
                <a-tab-pane key="1" :title="$t('cardList.tab.title.all')">
                  <!-- <QualityInspection />
                  <TheService />
                  <RulesPreset /> -->
                </a-tab-pane>
                <a-tab-pane key="2" :title="$t('cardList.tab.title.content')">
                  <!-- <QualityInspection /> -->
                </a-tab-pane>
                <a-tab-pane key="3" :title="$t('cardList.tab.title.service')">
                  <!-- <TheService /> -->
                </a-tab-pane>
                <a-tab-pane key="4" :title="$t('cardList.tab.title.preset')">
                  <!-- <RulesPreset /> -->
                </a-tab-pane>
              </a-tabs>
            </a-col>
            <a-input-search
              :placeholder="$t('cardList.searchInput.placeholder')"
              style="width: 240px; position: absolute; top: 60px; right: 20px"
            />
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import Breadcrumb from '@/components/breadcrumb/index.vue'
</script>

<style lang="scss" scoped></style>
