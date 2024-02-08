<template>
  <section class="faq pt-5 pb-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-12">
          <div class="section-title text-center pb-40 sectionTitleAfterWelcome">
            <div class="sub-title mb-5">
              <span>للإجابة على</span>
            </div>

            <span class="title fs-1" data-aos="fade-up" data-aos-delay="200">الأسئلة المتكررة</span>
          </div>
          <div class="normal-content mt-4">
            <Accordion :multiple="true">
              <AccordionTab header="لأي جهة تتبع منصة شفاء؟">
                هي إحدى مبادرات صندوق الوقف الصحي الذي له شخصية اعتبارية مستقلة، وصدر تنظيم الصندوق بقرار مجلس الوزراء رقم (19) وتاريخ 26/1/1429هـ، وتم تعديل التنظيم بقرار مجلس الوزراء رقم (353) وتاريخ 21/6/1440هـ ويضم في عضوية مجلس إدارته ممثلين من الجهات الحكومية التالية: وزارة الصحة، الهيئة العامة للأوقاف ، وزارة الموارد البشرية والتنمية الاجتماعية ، المجلس الصحي السعودي، بالإضافة لأعضاء من المهتمين بالعمل الخيري من المجتمع.
              </AccordionTab>
              <AccordionTab header="لماذا منصة شفاء؟">
                <ul class="faq__list">
                  <li>سرعة الوصول للمرضى المحتاجين.</li>
                  <li>توفير قناة ميسرة وموثوقة للتبرع.</li>
                  <li>الإسهام في حوكمة العلاج الخيري في المملكة من خلال التحقق من أبشر ومجلس الضمان الصحي.</li>
                  <li>تمكين الجمعيات الأهلية الصحية لتحقيق أثراً إيجابياً في المجتمع.</li>
                </ul>
              </AccordionTab>
              <AccordionTab header="من الفئة المستفيدة من منصة شفاء؟">
                المرضى غير القادرين على تحمل تكاليف العلاج وممن ليس لديهم أهلية علاج داخل المملكة العربية السعودية.
              </AccordionTab>

              <AccordionTab header="هل منصة شفاء تقبل الزكاة؟">
                بناءً على فتوى سماحة مفتي عام المملكة فضيلة الشيخ عبدالعزيز بن عبدالله آل الشيخ برقم 241 حول جواز استقبال الزكاة في منصة شفاء ، حيث أجاب فضيلته بجواز استقبال التبرعات والزكاة للمرضى المحتاجين لتكاليف العلاج والدواء.
              </AccordionTab>
              <AccordionTab header="هل أستطيع أن أتبرع بقيمة الحالة جزئياً؟">
                نعم يمكن التبرع بأي مبلغ من التكلفة الإجمالية للعلاج.
              </AccordionTab>
              <AccordionTab header="أين يتم علاج الحالات المعروضة في منصة شفاء؟">
                يتم علاجها في المستشفيات الحكومية والخاصة المرخصة من وزارة الصحة بناءً على خطة علاجية واضحة قبل إجراء العلاج.
              </AccordionTab>
              <AccordionTab header="كيف أستفيد من منصة شفاء إذا كنت لا أملك قيمة تكاليف العلاج؟">
                إذا كنت من الفئة المستهدفة يمكنك التواصل مع الجمعيات المعتمدة في منصة شفاء والتواصل معهم ليتم دراسة اضافتك إلى منصة شفاء
              </AccordionTab>
              <AccordionTab header="كيف أتبرع؟">
                يمكنك التبرع عبر القنوات الإلكترونية المعروضة في منصة شفاء.
              </AccordionTab>
              <AccordionTab header="لماذا تتفاوت تكاليف بعض العمليات والإجراءات الطبية من حالة إلى أخرى ؟">
                هناك عدة أسباب منها ، اختلاف التكلفة بين المستشفيات والمراكز الطبية المتنوعة في مناطق المملكة، اختلاف الاجراء الطبي بين كل حالة وأخرى، واختلاف الخصم الخيري المقدم من مقدم الخدمة الطبية.
              </AccordionTab>
              <AccordionTab header="هل للمنصة شركاء؟">
                تعتز منصة شفاء بالعمل مع عدد من الشركاء في مرحلة التأسيس والتشغيل والتسويق، وترحب بأي شريك لديه الرغبة بالانضمام لقائمة الشركاء بالتواصل معنا على الايميل:<a href="mailto:cc@shfa.sa" class="faq__link">cc@shefa.sa</a>
              </AccordionTab>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "PrivacyPolicy"
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables";
@import "@/styles/abstracts/mixins";
.faq {
  background: white;
  .container {
    padding: 0 0 45px 0;
  }

  .sub-title {
    direction: rtl;
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    line-height: 2;
  }

  .normal-content {
    font-size: 13px;
  }

  &__link {
    color: $color-primary;
  }
  ::v-deep(.p-accordion .p-accordion-tab) {
    margin-bottom: 12px;
  }
  ::v-deep(.p-accordion .p-accordion-header .p-accordion-header-link) {
    color: $color-primary-border;
  }
  ::v-deep(.p-accordion .p-accordion-header .p-accordion-header-link .p-accordion-toggle-icon) {
    margin-right: 0;
    margin-left: .5rem;
  }
  ::v-deep(.p-accordion .p-accordion-header:not(.p-highlight):not(.p-disabled):hover .p-accordion-header-link) {
    color: $color-primary-hover;
  }
  ::v-deep(.p-accordion .p-accordion-header:not(.p-disabled).p-highlight:hover .p-accordion-header-link) {
    color: $color-primary-hover;
  }

  @include respond(md) {
    .container {
      padding: 0 10px;
    }
  }
}

.pb-40 {
  padding-bottom: 40px;
}
</style>
