<template>
    <transition :name="animateName">
      <div v-show="show" :style="slideSytel" class="el-slide">
        <div v-if="showMask" class="el-dialog__wrapper" style="z-index: -1;background-color: #395F73;opacity:0.3;"></div>
          <el-card class="box-card" :body-style="bodyStyle" style="display: flex;flex-direction: column;flex: 1 1 100%;overflow: auto;">
            <div slot="header" class="clearfix">
              <span>{{title}}</span>
              <el-button style="float: right; padding: 3px 0" type="text" @click="hide"><i class="el-icon-close"></i></el-button>
            </div>
            <div v-loading="loading" style="flex: 1 1 100%;overflow: auto;position: relative;">
              <div ref="htmlSegment"></div>
              <slot v-if="!hasUrl"></slot>
            </div>
            <div style="padding-top: 15px;" v-if="footer">
              <el-button-group size="mini">
              <el-button type="primary" size="mini" @click="handerOk">{{okText}}</el-button>
              <el-button size="mini" @click="handerCancel">{{cancelText}}</el-button>
              </el-button-group>
            </div>
          </el-card>
      </div>
    </transition>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: 'Info'
      },
      okText: {
        type: String,
        default: 'OK'
      },
      cancelText: {
        type: String,
        default: 'Canel'
      },
      url: String,
      position: {
        type: String,
        default: 'left'
      },
      height: {
        type: [String, Number],
        default: '100%'
      },
      width: {
        type: [String, Number],
        default: ''
      },
      footer: {
        type: Boolean,
        default: true
      },
      modal: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        htmlstr: '',
        loading: true,
        params: {},
        cb: '',
        show: false
      }
    },
    computed: {
      showMask() { /* 控制是否有遮蔽层 */
          return this.modal == true || this.modal == 'true';
        },
        hasUrl() {
          return this.url ? true : false;
        },
        animateName() { /* 滑出方式的映射 */
          var codes = {
            top: 'el-zoom-in-top',
            bottom: 'el-zoom-in-bottom',
            center: 'el-zoom-in-center',
            left: 'left',
            right: 'left'
          }
          return codes[this.position]
        },
        slideSytel() { /* 滑出层根据方位调整布局 */
          var style = {
            width: '100%',
            height: this.height,
            display: 'flex',
            position: 'absolute',
            'background-color': '#fff',
            'z-index': '2000'
          };
          if (!isNaN(this.height)) {
            style.height += 'px'
          }
          if (this.position == 'left' || this.position == 'right') {
            style.width = '60%';
            style.right = 0;
            if (this.width) {
              style.width = typeof this.width == 'string' ? this.width : this.width + 'px';
            }
          }
          if (this.position == 'bottom') {
            style.bottom = 0;
            style.left = 0;
          } else {
            style.top = 0
          }
          return style;
        },
        bodyStyle() {
          return {
            display: 'flex',
            'flex-direction': 'column',
            flex: '1 1 100%',
            overflow: 'auto'
          }
        },
        url_show() {
          return this.url + this.show;
        }
    },
    watch: {
      url_show() {
        if (this.show) this.getHtml();
      }
    },
    methods: {
      getHtml() { /* 通过url获取远程页面 */
          var vm = this,
            queryData = {};
          if (this.params) Object.assign(queryData, this.params);

          if (vm.url) {
            vm.loading = true;
            $.ajax({
              type: 'post',
              url: vm.url,
              data: queryData,
              dataType: 'html',
              success: function(html) {
                vm.$refs.htmlSegment.innerHTML = html
                var scripts = vm.$refs.htmlSegment.querySelectorAll(
                  'script');
                setTimeout(function() {
                  Array.from(scripts).map(function(script) { /* 执行远程的脚本 */
                    if (vm.$refs.htmlSegment.contains(script)) {
                      vm.$refs.htmlSegment.removeChild(script);
                    }
                    var newScript = document.createElement(
                      'script');
                    newScript.type = 'text/javascript';
                    newScript.innerHTML = script.innerHTML;
                    vm.$refs.htmlSegment.appendChild(newScript);
                  });
                  if (vm.cb && typeof vm.cb == 'function') vm.cb();
                }, 0);
                vm.loading = false;
              },
              error: function() {
                vm.htmlstr = 'error...';
                vm.loading = false;
              }
            });
          } else {
            vm.loading = false;
          }
        },
        hide() {
          this.show = false
        },
        showSlide(params, cb) {
          this.show = true;

          this.cb = cb;
          if (typeof params == 'function') {
            this.cb = params;
            this.params = '';
          } else this.params = params;
        },
        handerOk(ev) {
          this.$emit('ok', ev)
        },
        handerCancel(ev) {
          this.$emit('cancel', ev);
          this.hide();
        }
    }
  }
</script>
<style>
.transition-box {
  width: 100%;
  position: absolute;
  border-radius: 4px;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: rgba(158, 200, 222, 0.35) 0px 10px 32px;
  z-index: 1000;
}

</style>
