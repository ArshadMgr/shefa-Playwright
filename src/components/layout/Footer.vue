<template>
  <section class="contact-area">
    <div class="container">
      <div class="row" data-aos="fade-up" data-aos-delay="200">
        <div class="mt-5">
          <h4 class="footer-title mb-5 text-center fs-1">شركاؤنا</h4>
          <div class="col-lg-12 col-sm-12">
            <div class="footer-link-logo row align-items-center justify-content-evenly" data-cy="our-partners-logo">
              <div  class="footer-image-container col-6 col-sm-2 row justify-content-center">
                <img class="footer-partner-logo" data-toggle="tooltip"
                  src="../../assets/images/gomaih.png"
                  title="الجميح" alt="الجميح">
              </div>
              <div  class="col-6 col-sm-2 row justify-content-center">
                <img class="footer-partner-logo" data-toggle="tooltip"
                  src="../../assets/images/council_of_health.png"
                  title="مجلس الضمان الصحي"
                  alt="مجلس الضمان الصحي">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer-area">
    <div class="footer-copyright">
      <a class="to-top position-relative mb-5" @click="scrollToTop"></a>
      <div class="container">
        <div class="row align-items-center">
          <div class="d-flex align-items-center justify-content-center text-white mb-4">
            <router-link to="/partnership-request">
              <div class="px-2 pointer text-center">طلب شراكة</div>
            </router-link>
            <div class="v-separator"></div>
            <div class="px-2 pointer text-center">
              <router-link to="/privacy-policy">
                سياسة الاستخدام و الخصوصية
              </router-link>
            </div>
            <div class="v-separator"></div>
            <div class="px-2 pointer text-center">
              <router-link to="/faq" class="text-white">
                الأسئلة المتكررة
              </router-link>
            </div>
          </div>
          <div class="copyright text-center mt-3">
            <p class="text">جميع الحقوق محفوظة {{toIndianDigits(year)}}</p>
          </div>
        </div>
      </div>
    </div>
  </footer>

</template>

<script>
export default {
  name: "FooterSection",
  data() {
    return {
      year: new Date().getFullYear(),
    };
  },
  methods: {
    scrollToTop() {
      if (window) {

        window.scroll({
          top: 0,
          left: 0,
          behavior: "smooth"
        });
      }
    },
    toIndianDigits(num) {
      const id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
      return num.toString().replace(/\d/g, (w) => {
        return id[+w]
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
.footer-area {

  .footer-widget {
    padding-top: 90px;
    padding-bottom: 120px;
  }

  .mobileFooter {
    display: none;
  }

  .footer-widget {

    .footer-title {
      font-weight: 700;
      line-height: 18px;
      color: #6c6c6c;
    }

    .footer-link {
      margin-top: 32px;

      ul {
        margin-top: 8px;

        li {

          a {
            font-size: 16px;
            line-height: 24px;
            color: #121212;
            margin-top: 16px;
            font-weight: 500;
            -webkit-transition: all 0.3s ease-out 0s;
            -moz-transition: all 0.3s ease-out 0s;
            -ms-transition: all 0.3s ease-out 0s;
            -o-transition: all 0.3s ease-out 0s;
            transition: all 0.3s ease-out 0s;
            text-decoration: none;

            &:hover {
              color: #38f9d7;
            }

          }
        }
      }
    }
  }

  .footer-copyright {
    padding-top: 35px;
    padding-bottom: 15px;
    background: $color-footer-bcg;

    .copyright {

      .text {
        color: #ffffff;
      }
    }

    a {
      color: white;
      text-decoration: none;
    }
  }

  .to-top {
    display: block;
    width: 75px;
    height: 82px;
    background: url(../../assets/icons/to-top.svg) no-repeat center;
    margin: -76px auto 0px auto;
    z-index: 10;
    cursor: pointer;
  }
}

.dir-rtl {
  direction: rtl;
}

.contact-area {
  padding-bottom: 100px;
  direction: rtl;
  background: #ffffff url(../../assets/images/polygon.png) no-repeat -122px 437px;
  background-size: 30%;
}

.contact-area h4 {
  direction: rtl;
  text-align: right;
  display: block;
  font-size: 40px;
  font-weight: lighter;
  width: 100%;
}

.contact-area .footer-link ul li {
  text-align: right;
  background: url(../../assets/images/linkDot.png) no-repeat right;
}

.contact-area .footer-link ul li:hover {
  background: url(../../assets/images/linkDotHover.png) no-repeat right;
}

.contact-area .footer-link ul li a {
  font-size: 18px;
  line-height: 24px;
  color: #121212;
  padding: 5px 25px 5px 0;
  font-weight: lighter;
  text-align: right;
  direction: rtl;
  cursor: pointer;
  -webkit-transition: all 0.3s ease-out 0s;
  -moz-transition: all 0.3s ease-out 0s;
  -ms-transition: all 0.3s ease-out 0s;
  -o-transition: all 0.3s ease-out 0s;
  transition: all 0.3s ease-out 0s;
  text-decoration: none;

  &:hover {
    text-decoration: none;
  }

}

.contact-area .footer-link-logo ul li {
  float: right;
  margin-left: 40px;
}

.contact-area .footer-link-logo ul li.last {
  margin-left: 0;
}
.contact-area .footer-link-logo {
  .footer-partner-logo {
    height: auto;
    width: 100%;
  }
  margin-left: 0;
}

.contact-area .footer-link-logo ul li a {
  -webkit-transition: all 0.3s ease-out 0s;
  -moz-transition: all 0.3s ease-out 0s;
  -ms-transition: all 0.3s ease-out 0s;
  -o-transition: all 0.3s ease-out 0s;
  transition: all 0.3s ease-out 0s;
}

.form-message.error, .form-message.success {
  font-size: 16px;
  color: #121212;
  padding: 10px 15px;
  margin-top: 15px;
  background-color: #e9ecef;
}

.form-message.error {
  color: #fc3832;
}

.single-contact-box {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px 35px;
  height: 255px;
}

.single-contact-box .box-icon {
  position: relative;
  display: inline-block;
}

.single-contact-box .box-icon i {
  font-size: 88px;
  position: relative;
  z-index: 5;
  color: #38f9d7;
}

.single-contact-box .box-icon .shape {
  position: absolute;
  top: 0;
  left: 0;
}

.single-contact-box .box-content {
  margin-top: 24px;
}

.single-contact-box .box-content .box-title {
  font-size: 28px;
  line-height: 35px;
  color: #121212;
}

.single-contact-box .box-content .text {
  font-size: 14px;
  line-height: 20px;
  color: #121212;
  margin-top: 16px;
}

.contact-two .contact-title {
  font-size: 24px;
  font-weight: 600;
  color: #121212;
}

.contact-two .text {
  font-size: 16px;
  line-height: 24px;
  margin-top: 16px;
  color: #6c6c6c;
}

.contact-two .contact-info {
  margin-top: 40px;
}

.contact-two .contact-info li {
  color: #6c6c6c;
  margin-top: 8px;
  font-size: 16px;
}

.contact-two .contact-info li i {
  margin-right: 5px;
  color: #121212;
}

.contact-map .gmap_canvas iframe {
  width: 100%;
  height: 400px;
}

.form-group {
  margin-bottom: 0;
}

.form-input label {
  font-size: 12px;
  line-height: 18px;
  color: #6c6c6c;
  margin-bottom: 8px;
  display: inline-block;
}

.form-input .input-items {
  position: relative;
}

.form-input .input-items input, .form-input .input-items textarea {
  width: 100%;
  height: 44px;
  border: 2px solid #F6F6F6;
  border-radius: 3px;
  padding: 33px 44px 33px 12px;
  position: relative;
  font-size: 16px;
  color: #B8B8B8;
}

.form-input .input-items input:focus, .form-input .input-items textarea:focus {
  border-color: #38f9d7;
}

.form-input .input-items input::placeholder, .form-input .input-items textarea::placeholder {
  color: #6c6c6c;
  opacity: 1;
}

.form-input .input-items input::-moz-placeholder, .form-input .input-items textarea::-moz-placeholder {
  color: #6c6c6c;
  opacity: 1;
}

.form-input .input-items input::-moz-placeholder, .form-input .input-items textarea::-moz-placeholder {
  color: #6c6c6c;
  opacity: 1;
}

.form-input .input-items input::-webkit-input-placeholder, .form-input .input-items textarea::-webkit-input-placeholder {
  color: #6c6c6c;
  opacity: 1;
}

.form-input .input-items textarea {
  padding-top: 21px;
  height: 170px;
  resize: none;
}

.form-input .input-items i {
  position: absolute;
  top: 23px;
  right: 16px;
  font-size: 20px;
  z-index: 9;
  color: #17BCB3;
}

.v-separator {
  width: 1px;
  height: 20px;
  margin: 4px 10px 0;
  background-color: #3D3D3D;
}

.pointer {
  cursor: pointer;
}
</style>
