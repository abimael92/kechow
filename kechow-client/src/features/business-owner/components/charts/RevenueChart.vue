<template>
  <div class="revenue-chart" :style="{ height: `${height}px` }">
    <!-- Chart Header -->
    <div v-if="showHeader" class="chart-header">
      <slot name="header">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ title }}
            </h3>
            <div v-if="period" class="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
              {{ period }}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <slot name="header-actions"></slot>
            <button
              v-if="showDownload"
              @click="downloadChart"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              :title="t('downloadChart')"
            >
              <i class="ri-download-line text-gray-600 dark:text-gray-300"></i>
            </button>
          </div>
        </div>
      </slot>
    </div>

    <!-- Chart Container -->
    <div ref="chartContainer" class="chart-container relative" :style="{ height: `${chartHeight}px` }">
      <!-- Loading State -->
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 z-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!hasData" class="absolute inset-0 flex flex-col items-center justify-center">
        <i class="ri-line-chart-line text-4xl text-gray-300 dark:text-gray-600 mb-3"></i>
        <p class="text-gray-500 dark:text-gray-400 text-center">{{ emptyMessage }}</p>
        <button
          v-if="showRefresh"
          @click="$emit('refresh')"
          class="mt-4 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <i class="ri-refresh-line mr-2"></i>
          {{ t('refreshData') }}
        </button>
      </div>

      <!-- Chart Canvas -->
      <canvas v-else ref="chartCanvas" :width="canvasWidth" :height="chartHeight"></canvas>

      <!-- Tooltip -->
      <div
        v-if="showTooltip && tooltipVisible"
        ref="tooltip"
        class="tooltip absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 z-50 min-w-[180px]"
        :style="tooltipStyle"
      >
        <div class="text-sm font-semibold text-gray-900 dark:text-white mb-1">
          {{ tooltipData.label }}
        </div>
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('revenue') }}</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">${{ formatCurrency(tooltipData.revenue) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('orders') }}</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">{{ tooltipData.orders }}</span>
          </div>
          <div v-if="tooltipData.avgOrderValue" class="flex items-center justify-between">
            <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('avgOrderValue') }}</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white">${{ formatCurrency(tooltipData.avgOrderValue) }}</span>
          </div>
          <div v-if="tooltipData.change" class="flex items-center justify-between">
            <span class="text-xs text-gray-600 dark:text-gray-400">{{ t('change') }}</span>
            <span
              class="text-sm font-medium"
              :class="tooltipData.change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'"
            >
              {{ tooltipData.change >= 0 ? '+' : '' }}{{ formatCurrency(tooltipData.change) }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div
        v-if="showLegend && hasData"
        class="legend absolute bottom-0 left-0 right-0 flex flex-wrap items-center justify-center gap-3 pt-4"
      >
        <div
          v-for="(item, index) in legendItems"
          :key="index"
          class="flex items-center gap-2 cursor-pointer"
          @click="toggleDataset(item.id)"
          @mouseenter="highlightDataset(item.id)"
          @mouseleave="resetHighlight"
        >
          <div
            class="w-3 h-3 rounded-full transition-opacity"
            :style="{ backgroundColor: item.color, opacity: item.active ? 1 : 0.3 }"
          ></div>
          <span
            class="text-xs font-medium transition-colors"
            :class="[
              item.active
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400',
              'hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            {{ item.label }}
          </span>
          <span
            v-if="item.value"
            class="text-xs font-semibold ml-1"
            :class="item.active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'"
          >
            {{ item.value }}
          </span>
        </div>
      </div>
    </div>

    <!-- Chart Footer -->
    <div v-if="showFooter && hasData" class="chart-footer mt-4">
      <slot name="footer">
        <div class="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <i class="ri-information-line"></i>
              <span>{{ t('hoverForDetails') }}</span>
            </div>
            <div v-if="totalRevenue" class="flex items-center gap-2">
              <i class="ri-money-dollar-circle-line"></i>
              <span>{{ t('totalRevenue') }}: <strong class="text-gray-900 dark:text-white">${{ formatCurrency(totalRevenue) }}</strong></span>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-primary-500"></div>
              <span>{{ t(type === 'line' ? 'lineChart' : type === 'bar' ? 'barChart' : 'areaChart') }}</span>
            </div>
            <button
              v-if="showPeriodSelector"
              @click="$emit('period-change')"
              class="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {{ t('changePeriod') }}
            </button>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

// Define the props interface locally
interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

interface RevenueChartProps {
  data: ChartDataPoint[];
  type: 'line' | 'bar' | 'area';
  height?: number;
  showTooltip?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  showDownload?: boolean;
  showRefresh?: boolean;
  showPeriodSelector?: boolean;
  title?: string;
  period?: string;
  emptyMessage?: string;
  loading?: boolean;
  colors?: string[];
  animationDuration?: number;
  responsive?: boolean;
}

export default defineComponent({
  name: 'RevenueChart',
  
  props: {
    data: {
      type: Array as () => ChartDataPoint[],
      required: true,
      default: () => []
    },
    type: {
      type: String as () => 'line' | 'bar' | 'area',
      default: 'line'
    },
    height: {
      type: Number,
      default: 300
    },
    showTooltip: {
      type: Boolean,
      default: true
    },
    showGrid: {
      type: Boolean,
      default: true
    },
    showLegend: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    },
    showDownload: {
      type: Boolean,
      default: true
    },
    showRefresh: {
      type: Boolean,
      default: false
    },
    showPeriodSelector: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Revenue Trend'
    },
    period: {
      type: String,
      default: ''
    },
    emptyMessage: {
      type: String,
      default: 'No revenue data available'
    },
    loading: {
      type: Boolean,
      default: false
    },
    colors: {
      type: Array as () => string[],
      default: () => ['#8b34e0', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
    },
    animationDuration: {
      type: Number,
      default: 1000
    },
    responsive: {
      type: Boolean,
      default: true
    }
  },

  emits: {
    'point-click': (data: ChartDataPoint) => true,
    'refresh': () => true,
    'period-change': () => true,
    'download': (format: string) => true
  },

  setup(props: RevenueChartProps, { emit }) {
    const { t } = useI18n();

    // Refs
    const chartContainer = ref<HTMLElement>();
    const chartCanvas = ref<HTMLCanvasElement>();
    const tooltip = ref<HTMLElement>();
    const chartInstance = ref<any>(null);
    const tooltipVisible = ref(false);
    const tooltipData = ref<any>({});
    const tooltipStyle = ref({ left: '0px', top: '0px' });
    const canvasWidth = ref(0);
    const chartHeight = ref((props.height ?? 300) - 100);

    // Computed
    const hasData = computed(() => props.data && props.data.length > 0);
    
    const totalRevenue = computed(() => {
      if (!hasData.value) return 0;
      return props.data.reduce((sum, point) => sum + point.value, 0);
    });

    const legendItems = computed(() => {
      const items = [
        {
          id: 'revenue',
          label: t('revenue'),
          color: props.colors?.[0] || '#8b34e0',
          active: true,
          value: `$${formatCurrency(totalRevenue.value)}`
        }
      ];

      if (props.type === 'line' && props.data.length > 1) {
        const avg = totalRevenue.value / props.data.length;
        items.push({
          id: 'average',
          label: t('average'),
          color: props.colors?.[1] || '#3b82f6',
          active: true,
          value: `$${formatCurrency(avg)}`
        });
      }

      return items;
    });

    // Methods
    const formatCurrency = (value: number) => {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      }
      if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
      }
      return value.toFixed(0);
    };

    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const initChart = async () => {
      if (!hasData.value || !chartCanvas.value) return;

      // Lazy load Chart.js
      let Chart: any;
      try {
        const ChartModule = await import('chart.js/auto');
        Chart = ChartModule.default;
      } catch (error) {
        console.error('Failed to load Chart.js:', error);
        return;
      }

      // Clear previous chart
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }

      // Set canvas dimensions
      if (props.responsive && chartContainer.value) {
        canvasWidth.value = chartContainer.value.clientWidth;
      }

      const ctx = chartCanvas.value.getContext('2d');
      if (!ctx) return;

      // Prepare data
      const labels = props.data.map(point => formatDate(point.date));
      const values = props.data.map(point => point.value);

      // Calculate trend line (moving average)
      const trendData = values.map((_, index) => {
        const window = 3;
        const start = Math.max(0, index - Math.floor(window / 2));
        const end = Math.min(values.length, start + window);
        const windowValues = values.slice(start, end);
        return windowValues.reduce((sum, val) => sum + val, 0) / windowValues.length;
      });

      // Chart configuration
      const config: any = {
        type: props.type,
        data: {
          labels,
          datasets: [
            {
              label: t('revenue'),
              data: values,
              backgroundColor: props.type === 'line' || props.type === 'area' 
                ? 'transparent'
                : (props.colors?.[0] || '#8b34e0') + '80',
              borderColor: props.colors?.[0] || '#8b34e0',
              borderWidth: props.type === 'line' || props.type === 'area' ? 3 : 2,
              fill: props.type === 'area',
              tension: 0.4,
              pointBackgroundColor: props.colors?.[0] || '#8b34e0',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              pointRadius: 6,
              pointHoverRadius: 8
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: props.animationDuration,
            easing: 'easeOutQuart'
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: false,
              external: handleTooltip
            }
          },
          scales: {
            x: {
              grid: {
                display: props.showGrid,
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                color: '#6b7280',
                font: {
                  size: 11
                },
                maxRotation: 45
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                display: props.showGrid,
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                color: '#6b7280',
                font: {
                  size: 11
                },
                callback: (value: number) => `$${formatCurrency(value)}`
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          },
          onHover: (event: any, elements: any[]) => {
            if (chartCanvas.value) {
              chartCanvas.value.style.cursor = elements.length > 0 ? 'pointer' : 'default';
            }
          },
          onClick: (event: any, elements: any[]) => {
            if (elements.length > 0) {
              const index = elements[0].index;
              const dataPoint = props.data[index];
              emit('point-click', dataPoint);
            }
          }
        }
      };

      // Add trend line for line charts
      if (props.type === 'line' && props.data.length > 1) {
        config.data.datasets.push({
          label: t('average'),
          data: trendData,
          type: 'line',
          borderColor: props.colors?.[1] || '#3b82f6',
          borderWidth: 2,
          borderDash: [5, 5],
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 0
        });
      }

      // Adjust for dark mode
      if (document.documentElement.classList.contains('dark')) {
        config.options.scales.x.grid.color = 'rgba(255, 255, 255, 0.05)';
        config.options.scales.y.grid.color = 'rgba(255, 255, 255, 0.05)';
        config.options.scales.x.ticks.color = '#9ca3af';
        config.options.scales.y.ticks.color = '#9ca3af';
      }

      chartInstance.value = new Chart(ctx, config);
    };

    const handleTooltip = (context: any) => {
      const { chart, tooltip } = context;
      const chartRect = chart.canvas.getBoundingClientRect();

      if (tooltip.opacity === 0) {
        tooltipVisible.value = false;
        return;
      }

      const index = tooltip.dataPoints[0]?.dataIndex;
      if (index === undefined) return;

      const dataPoint = props.data[index];
      const trendData = props.data.map(p => p.value);
      const previousValue = index > 0 ? trendData[index - 1] : trendData[0];
      const change = previousValue ? ((dataPoint.value - previousValue) / previousValue) * 100 : 0;

      tooltipData.value = {
        label: dataPoint.label || formatDate(dataPoint.date),
        revenue: dataPoint.value,
        orders: Math.floor(dataPoint.value / 28.5),
        avgOrderValue: 28.5,
        change: parseFloat(change.toFixed(1))
      };

      // Position tooltip
      const left = Math.max(10, Math.min(
        chartRect.width - 200,
        tooltip.caretX - 90
      ));
      const top = Math.max(10, tooltip.caretY - 120);

      tooltipStyle.value = {
        left: `${left}px`,
        top: `${top}px`
      };

      tooltipVisible.value = true;
    };

    const downloadChart = () => {
      if (!chartCanvas.value) return;

      const link = document.createElement('a');
      link.download = `revenue-chart-${new Date().toISOString().split('T')[0]}.png`;
      link.href = chartCanvas.value.toDataURL('image/png');
      link.click();

      emit('download', 'png');
    };

    const toggleDataset = (datasetId: string) => {
      if (!chartInstance.value) return;
      
      const meta = chartInstance.value.getDatasetMeta(0);
      const isHidden = meta.hidden === null ? false : meta.hidden;
      
      chartInstance.value.setDatasetVisibility(0, !isHidden);
      chartInstance.value.update();
    };

    const highlightDataset = (datasetId: string) => {
      if (!chartInstance.value) return;
      
      chartInstance.value.data.datasets.forEach((dataset: any, index: number) => {
        if (index === 0) return;
        dataset.borderWidth = 1;
        dataset.borderColor += '40';
      });
      
      chartInstance.value.update('none');
    };

    const resetHighlight = () => {
      if (!chartInstance.value) return;
      
      chartInstance.value.data.datasets.forEach((dataset: any, index: number) => {
        if (index === 0) return;
        dataset.borderWidth = 2;
        dataset.borderColor = dataset.borderColor.replace('40', '');
      });
      
      chartInstance.value.update('none');
    };

    const handleResize = () => {
      if (props.responsive && chartContainer.value) {
        canvasWidth.value = chartContainer.value.clientWidth;
        if (chartInstance.value) {
          chartInstance.value.resize();
        }
      }
    };

    // Lifecycle
    onMounted(() => {
      if (hasData.value) {
        nextTick(() => {
          initChart();
        });
      }

      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }
      window.removeEventListener('resize', handleResize);
    });

    // Watchers
    watch(() => props.data, () => {
      if (hasData.value) {
        nextTick(initChart);
      }
    }, { deep: true });

    watch(() => props.type, initChart);
    watch(() => props.height, (newHeight) => {
      if (newHeight !== undefined) {
        chartHeight.value = newHeight - 100;
      }
    });

    return {
      // Refs
      chartContainer,
      chartCanvas,
      tooltip,
      tooltipVisible,
      tooltipData,
      tooltipStyle,
      
      // Computed
      hasData,
      totalRevenue,
      legendItems,
      
      // Methods
      t,
      formatCurrency,
      formatDate,
      initChart,
      handleTooltip,
      downloadChart,
      toggleDataset,
      highlightDataset,
      resetHighlight,
      handleResize,
      
      // Props (exposed for template)
      type: props.type,
      showTooltip: props.showTooltip,
      showLegend: props.showLegend,
      showHeader: props.showHeader,
      showFooter: props.showFooter,
      showDownload: props.showDownload,
      showRefresh: props.showRefresh,
      showPeriodSelector: props.showPeriodSelector,
      title: props.title,
      period: props.period,
      emptyMessage: props.emptyMessage,
      loading: props.loading,
      colors: props.colors,
      
      // Local refs
      canvasWidth,
      chartHeight
    };
  }
});
</script>

<style scoped>
.revenue-chart {
  @apply bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6;
}

.chart-container {
  position: relative;
}

.tooltip {
  pointer-events: none;
  transition: all 0.2s ease;
  animation: fadeIn 0.2s ease;
}

.legend {
  background: linear-gradient(to top, 
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.8) 50%,
    transparent 100%
  );
}

.dark .legend {
  background: linear-gradient(to top, 
    rgba(31, 41, 55, 0.95) 0%,
    rgba(31, 41, 55, 0.8) 50%,
    transparent 100%
  );
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Chart.js canvas styling */
canvas {
  max-width: 100%;
  height: auto;
}
</style>