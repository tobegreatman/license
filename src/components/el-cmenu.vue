<template>
    <transition :name="animateName">
      <div ref="menu" v-show="isShow" :class="ctnCls" :style="ctnStyle">
        <el-cmenu-item v-for="item in data" :data="item" :key="item.label" @menu-click="menuClick" @close-menu="hide"></el-cmenu-item>
      </div>
    </transition>
</template>

<script>
import elCmenuItem from '@/components/el-cmenu-item';
export default {
  name: 'el-cmenu',
  props: {
    data: {
      type: Array,
      default: function(){
        return []
      }
    }
  },
  data() {
    return {
      isShow: false,
      top: '',
      left: '',
      animateName: 'el-zoom-in-top'
    }
  },
  computed: {
    ctnCls() {
        return {
          cmenu: true,
          'item-left': true
        }
      },
      ctnStyle() {
        var style = {};

        if (this.top) style.top = this.top;
        if (this.left) style.left = this.left;
        return style;
      }
  },
  methods: {
    getOffsetTop: function(el) {
      return el.offsetParent ? el.offsetTop + this.getOffsetTop(el.offsetParent) :
        el.offsetTop
    },
    getOffsetLeft: function(el) {
      return el.offsetParent ? el.offsetLeft + this.getOffsetLeft(el.offsetParent) :
        el.offsetLeft
    },
    reposition(target, reference, vm) {
      var docH = window.innerHeight || document.documentElement.clientHeight ||
        document.body.clientHeight,
        tRect = reference.getBoundingClientRect(),
        mRect = target.getBoundingClientRect();
      /**
       * 根据相对视口的坐标偏移，计算相对位置的偏移量
       *（top偏移：rect的top的坐标偏移差，left偏移：rect的left坐标偏移差）
       **/
      var tTop = tRect.top,
        tLeft = tRect.left,
        mTop = mRect.top,
        mLeft = mRect.left,
        top = target.offsetTop + (tTop - mTop) + tRect.height + 12,
        left = target.offsetLeft + (tLeft - mLeft);
      var offsetD = tRect.y + tRect.height + 12;

      if (docH - offsetD < mRect.height) {
        vm.animateName = 'el-zoom-in-bottom';
        top = top - mRect.height - tRect.height - 24;
      }
      return {
        left: left,
        top: top
      };
    },
    show(ev) {
      var vm = this,
        menu = vm.$refs.menu;
      vm.animateName = 'el-zoom-in-top';
      if (ev) {
        menu.style.display = 'block';
        menu.style.opacity = 0;

        var pos = this.reposition(menu, ev.target, vm);
        vm.top = pos.top + 'px';
        vm.left = pos.left + 'px';

        ev.stopPropagation();
        setTimeout(function() {
          menu.style.opacity = 1;
        }, 0);
      }
      vm.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    menuClick(row, ev) {
      this.$emit('click', row, ev);
    }
  },
  components: {'el-cmenu-item':elCmenuItem}
}
</script>
