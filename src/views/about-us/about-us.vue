<template>
  <section class="about-area inner-page">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-12 p-4 p-lg-0">
          <div class="section-title text-center pb-40 sectionTitleAfterWelcome">
            <h4 class="title" data-aos="fade-up" data-aos-delay="250" data-cy="main-header">من نحن</h4>
          </div>
          <div class="normal-content">
            <div class="header my-4" data-cy="about-shefa-header">
              <strong>عن منصة شفاء</strong>
            </div>
            <div class="fw-semibold">
              <div class="mb-4" data-cy="about-shefa-first">
                شفاء هي منصة إلكترونية تتبع لصندوق الوقف الصحي تهدف إلى تسهيل تقديم الخدمات العلاجية، والـأجهزة الطبية،
                والأدوية للمحتاجين والمنقطعين والحالات الطارئة لمن ليس لديهم قدرة للحصول على العلاج في المنشآت الصحية.
              </div>
              <div class="mb-4" data-cy="about-shefa-second">والمنصة أنشئت بالتعاون مع وزارة الصحة والجمعيات
                الصحية الخيرية الرسمية في مختلف مناطق المملكة ومجلس الضمان الصحي ومنصة أبشر
                تعزيزاً للمصداقية والموثوقية.
              </div>
              <div class="mb-4">
            <span data-cy="about-shefa-third">وصندوق الوقف الصحي له شخصية اعتبارية
                  مستقلة، وصدر تنظيم الصندوق بقرار مجلس الوزراء رقم (19) وتاريخ 26/1/1429هـ، وتم
                  تعديل التنظيم بقرار مجلس الوزراء رقم (353) وتاريخ 21/6/1440هـ ويرأس مجلس إدارته معالي وزير الصحة وعضوية &nbsp;ممثلين من الجهات الحكومية التالية: وزارة الصحة، الهيئة العامة
                  للأوقاف ، وزارة الموارد البشرية والتنمية الاجتماعية ، المجلس الصحي السعودي،
                  بالإضافة لأعضاء من المهتمين بالعمل الخيري من المجتمع.
            </span>
              </div>
            </div>
            <div class="image">
              <img class="my-5 mw-100" src="../../assets/images/aboutus.png" alt="" data-cy="aboutus-img">
            </div>
            <div class="goals mb-3">
              <div class="header my-4" data-cy="objectves-header">
                <strong>أهدافها</strong>
              </div>
              <div class="item fw-semibold" data-cy="first-objective">
                • المساهمة في علاج المرضى المحتاجين ممن ليس لديهم أهلية
                علاج داخل المملكة.
              </div>
              <div class="item fw-semibold" data-cy="second-objective">
                •&nbsp; تحقيق الترابط
                الاجتماعي بين أفراد المجتمع.
              </div>
              <div class="item  fw-semibold" data-cy="third-objective">
                •&nbsp; تسهيل وصول المحسنين للمرضى المحتاجين بموثوقية.
              </div>
            </div>
            <div class="goals mb-3">
              <div class="header my-4" data-cy="shefa-pros-header">
                <strong>مميزات المنصة</strong>
              </div>
              <div class="item fw-semibold" data-cy="first-pros">
                • سرعة
                الوصول للمرضى المحتاجين.
              </div>
              <div class="item fw-semibold" data-cy="second-pros">
                •&nbsp; توفير قناة ميسرة
                وموثوقة للتبرع.
              </div>
              <div class="item fw-semibold" data-cy="third-pros">
                •&nbsp; الإسهام في حوكمة
                العلاج الخيري في المملكة من خلال التحقق من منصة أبشر ومجلس الضمان الصحي.
              </div>
              <div class="item fw-semibold" data-cy="fourth-pros">
                •&nbsp; تمكين الجمعيات
                الأهلية الصحية في تحقيق أثرا إيجابي في المجتمع.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

</template>

<script>
export default {
  name: "about-us"
};
</script>

<style lang="scss" scoped>
.about-area {
  position: relative;
  padding-bottom: 40px;
  background: #ffffff url(../../assets/images/polygon-grey.png) no-repeat -185px;
  background-size: contain;

  .container {
    padding: 0 0 45px 0;
  }

  .section-title {
    .title {
      font-size: 44px;
      font-weight: 600;
      line-height: 55px;
      color: #4A4A4A;
    }

    .text {
      font-size: 16px;
      line-height: 12px;
      color: #727272;
      margin-top: 30px;
      margin-bottom: 9px;
    }

  }

  .header {
    strong {
      font-size: 24px;
      color: #12B3AB;
    }
  }

  .goals {
    .item {
      font-size: 14px;
    }
  }
}
</style>
