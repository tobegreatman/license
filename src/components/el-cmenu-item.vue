<template>
  <div :class="cmenuItemCls" @click="itemClick">
    <span>{{data.label}}</span>
    <div class="item-child" v-if="hasChild">
      <el-cmenu-item v-for="item in data.child" :data="item" :key="item.label" @menu-click="menuClick"></el-cmenu-item>
    </div>
  </div>
</template>

<script>
export default{
  name: 'el-cmenu-item',
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {

    }
  },
  computed: {
    hasChild() {
        var has = false;
        if (this.data.child && this.data.child.length) has = true;
        return has;
      },
      cmenuItemCls() {
        var cls = {
          'cmenu-item': true,
          disabled: this.data.disable,
          'menu-hidden': this.data.show === false ? true : false
        };
        if (this.data.cls) cls[this.data.cls] = true;
        return cls;
      }
  },
  methods: {
    itemClick(ev) {
        this.$emit('menu-click', this.data, ev);
      },
      menuClick(row, ev) {
        if (row.disable != true) {
          this.$emit('menu-click', row, ev);
          this.$emit('close-menu', row, ev);
        }
        ev.stopPropagation();
      }
  }
}
</script>
