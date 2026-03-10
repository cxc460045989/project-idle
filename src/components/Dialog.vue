<template>
  <div v-if="visible" :class="['dialog-overlay', { visible }]" @click="handleOverlayClick">
    <div class="dialog-container" @click.stop>
      <div class="dialog-title">{{ title }}</div>
      <div class="dialog-message">{{ message }}</div>
      <div :class="['dialog-buttons', type === 'confirm' ? 'single' : '']">
        <button 
          v-if="onConfirm" 
          class="dialog-btn dialog-btn-primary" 
          @click="handleConfirm"
        >
          {{ confirmText || '确定' }}
        </button>
        <button 
          v-if="onCancel" 
          class="dialog-btn dialog-btn-secondary" 
          @click="handleCancel"
        >
          {{ cancelText || '取消' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '提示'
    },
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'alert',
      validator: value => ['alert', 'confirm'].includes(value)
    },
    closeOnOverlay: {
      type: Boolean,
      default: true
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    onConfirm: {
      type: [Function, Object],
      default: null
    },
    onCancel: {
      type: [Function, Object],
      default: null
    }
  },
  emits: ['confirm', 'cancel', 'close'],
  setup(props, { emit }) {
    const handleOverlayClick = () => {
      if (props.closeOnOverlay) {
        emit('close')
      }
    }

    const handleConfirm = () => {
      if (props.onConfirm && typeof props.onConfirm === 'function') {
        props.onConfirm()
      }
      emit('confirm')
      emit('close')
    }

    const handleCancel = () => {
      if (props.onCancel && typeof props.onCancel === 'function') {
        props.onCancel()
      }
      emit('cancel')
      emit('close')
    }

    return {
      handleOverlayClick,
      handleConfirm,
      handleCancel
    }
  }
}
</script>

<style lang="scss" scoped>
// 使用 @use 替代 @import（Sass 新版推荐）
@use '../styles/main.scss';
</style>
