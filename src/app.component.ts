import { Component, ChangeDetectionStrategy, signal, inject, effect, untracked, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { GeminiService } from './services/gemini.service';
import { DesignParameters } from './models/design-parameters.model';

@Component({
  selector: 'app-root',
  template: `
<main class="container mx-auto p-4 sm:p-6 lg:p-8">
  <header class="text-center mb-8">
    <h1 class="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-['Lemonada']">
      مصمم واجهات المحلات بالذكاء الاصطناعي
    </h1>
    <p class="mt-2 text-lg text-gray-400 font-['Amiri']">قم بتحويل واجهة متجرك بقوة الذكاء الاصطناعي التوليدي.</p>
  </header>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
    
    <!-- Left Column: Controls -->
    <div class="bg-gray-800 p-6 rounded-2xl shadow-2xl border border-gray-700 max-h-[85vh] overflow-y-auto">
      <form [formGroup]="designForm" (ngSubmit)="onSubmit()">
        <div id="design-accordion">
          
          <!-- Step 1: Upload -->
          <div>
            <h2 id="accordion-heading-upload">
              <button type="button" (click)="toggleAccordion('upload')" class="flex items-center justify-between w-full p-5 font-medium text-left text-gray-300 border-b border-gray-700 hover:bg-gray-700/50" [attr.aria-expanded]="activeAccordionSection() === 'upload'">
                <span class="text-xl text-purple-400 font-['Reem_Kufi']">1. ارفع صورة متجرك</span>
                <svg class="w-6 h-6 shrink-0 transition-transform" [class.rotate-180]="activeAccordionSection() === 'upload'" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            </h2>
            <div id="accordion-body-upload" [class.hidden]="activeAccordionSection() !== 'upload'">
              <div class="p-5 border-b border-gray-700">
                <label for="file-upload" class="w-full inline-flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-gray-700/50 transition-colors">
                    <svg class="w-8 h-8 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span class="font-medium text-gray-300">{{ originalImage()?.name || 'اختر صورة...' }}</span>
                </label>
                <input id="file-upload" type="file" class="hidden" (change)="onFileChange($event)" accept="image/png, image/jpeg">
              </div>
            </div>
          </div>
          
          <!-- Step 2: Cladding -->
          <div>
            <h2 id="accordion-heading-cladding">
              <button type="button" (click)="toggleAccordion('cladding')" class="flex items-center justify-between w-full p-5 font-medium text-left text-gray-300 border-b border-gray-700 hover:bg-gray-700/50" [attr.aria-expanded]="activeAccordionSection() === 'cladding'">
                <span class="text-xl text-purple-400 font-['Reem_Kufi']">2. التكسية / الخلفية</span>
                <svg class="w-6 h-6 shrink-0 transition-transform" [class.rotate-180]="activeAccordionSection() === 'cladding'" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            </h2>
            <div id="accordion-body-cladding" [class.hidden]="activeAccordionSection() !== 'cladding'">
              <div class="p-5 border-b border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2 mb-4">
                    <p class="text-sm text-gray-400 mb-2">أمثلة للمواد:</p>
                    <div class="flex gap-4 overflow-x-auto pb-2">
                      <div class="flex-shrink-0 text-center">
                        <img src="https://picsum.photos/seed/solidcolor/80/80" alt="صلب" class="w-16 h-16 rounded-md border border-gray-600 mx-auto mb-1" referrerpolicy="no-referrer">
                        <span class="text-xs text-gray-400">صلب</span>
                      </div>
                      <div class="flex-shrink-0 text-center">
                        <img src="https://picsum.photos/seed/woodtexture/80/80" alt="تأثير الخشب" class="w-16 h-16 rounded-md border border-gray-600 mx-auto mb-1" referrerpolicy="no-referrer">
                        <span class="text-xs text-gray-400">خشب</span>
                      </div>
                      <div class="flex-shrink-0 text-center">
                        <img src="https://picsum.photos/seed/marbletexture/80/80" alt="تأثير الرخام" class="w-16 h-16 rounded-md border border-gray-600 mx-auto mb-1" referrerpolicy="no-referrer">
                        <span class="text-xs text-gray-400">رخام</span>
                      </div>
                      <div class="flex-shrink-0 text-center">
                        <img src="https://picsum.photos/seed/louvers/80/80" alt="شرائح" class="w-16 h-16 rounded-md border border-gray-600 mx-auto mb-1" referrerpolicy="no-referrer">
                        <span class="text-xs text-gray-400">شرائح</span>
                      </div>
                    </div>
                  </div>
                  <div>
                      <label for="claddingMaterial" class="block text-sm font-medium text-gray-300 mb-1">المادة</label>
                      <select id="claddingMaterial" formControlName="claddingMaterial" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="Solid">صلب</option><option value="Timber effect">تأثير الخشب</option><option value="Marble effect">تأثير الرخام</option><option value="Louvers">شرائح (Louvers)</option></select>
                  </div>
                  <div>
                      <label for="claddingFinish" class="block text-sm font-medium text-gray-300 mb-1">التشطيب</label>
                      <select id="claddingFinish" formControlName="claddingFinish" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="Glossy">لامع</option><option value="Matte">مطفي</option><option value="Brushed Metal">معدن مصقول</option></select>
                  </div>
                  <div>
                      <label for="claddingPattern" class="block text-sm font-medium text-gray-300 mb-1">النمط</label>
                      <select id="claddingPattern" formControlName="claddingPattern" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="Horizontal panels">ألواح أفقية</option><option value="Vertical panels">ألواح عمودية</option><option value="Geometric squares">مربعات هندسية</option></select>
                  </div>
                  <div class="text-center">
                    <label for="claddingColor" class="block text-sm font-medium text-gray-300 mb-2">لون اللوح</label>
                    <input type="color" id="claddingColor" formControlName="claddingColor" class="w-12 h-12 rounded-full border-4 border-gray-700 cursor-pointer">
                  </div>
                   <div class="text-center">
                    <label for="claddingGrooveColor" class="block text-sm font-medium text-gray-300 mb-2">لون الفواصل</label>
                    <input type="color" id="claddingGrooveColor" formControlName="claddingGrooveColor" class="w-12 h-12 rounded-full border-4 border-gray-700 cursor-pointer">
                  </div>
              </div>
            </div>
          </div>

           <!-- Step 3: Cornice -->
          <div>
            <h2 id="accordion-heading-cornice">
              <button type="button" (click)="toggleAccordion('cornice')" class="flex items-center justify-between w-full p-5 font-medium text-left text-gray-300 border-b border-gray-700 hover:bg-gray-700/50" [attr.aria-expanded]="activeAccordionSection() === 'cornice'">
                <span class="text-xl text-purple-400 font-['Reem_Kufi']">3. الكورنيش والإطار</span>
                <svg class="w-6 h-6 shrink-0 transition-transform" [class.rotate-180]="activeAccordionSection() === 'cornice'" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            </h2>
            <div id="accordion-body-cornice" [class.hidden]="activeAccordionSection() !== 'cornice'">
              <div class="p-5 border-b border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2 mb-4">
                    <p class="text-sm text-gray-400 mb-2">أمثلة لأشكال الكورنيش:</p>
                    <div class="flex gap-4 overflow-x-auto pb-2">
                      <div class="flex-shrink-0 text-center">
                        <img src="https://picsum.photos/seed/flatcornice/80/80" alt="مسطح" class="w-16 h-16 rounded-md border border-gray-600 mx-auto mb-1" referrerpolicy="no-referrer">
                        <span class="text-xs text-gray-400">مسطح</span>
                      </div>
                      <div class="flex-shrink-0 text-center">
                        <img src="https://picsum.photos/seed/extrudedcornice/80/80" alt="بارز" class="w-16 h-16 rounded-md border border-gray-600 mx-auto mb-1" referrerpolicy="no-referrer">
                        <span class="text-xs text-gray-400">بارز</span>
                      </div>
                      <div class="flex-shrink-0 text-center">
                        <img src="https://picsum.photos/seed/chamferedcornice/80/80" alt="مشطوف" class="w-16 h-16 rounded-md border border-gray-600 mx-auto mb-1" referrerpolicy="no-referrer">
                        <span class="text-xs text-gray-400">مشطوف</span>
                      </div>
                      <div class="flex-shrink-0 text-center">
                        <img src="https://picsum.photos/seed/steppedcornice/80/80" alt="متدرج" class="w-16 h-16 rounded-md border border-gray-600 mx-auto mb-1" referrerpolicy="no-referrer">
                        <span class="text-xs text-gray-400">متدرج</span>
                      </div>
                    </div>
                  </div>
                  <div>
                      <label for="cornicePosition" class="block text-sm font-medium text-gray-300 mb-1">الموضع</label>
                      <select id="cornicePosition" formControlName="cornicePosition" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="Top Cap">غطاء علوي</option><option value="Full Box">صندوق كامل</option><option value="Top and Bottom">علوي وسفلي</option></select>
                  </div>
                  <div>
                      <label for="corniceShape" class="block text-sm font-medium text-gray-300 mb-1">الشكل</label>
                      <select id="corniceShape" formControlName="corniceShape" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="Flat">مسطح</option><option value="Extruded">بارز</option><option value="Chamfered/Slanted">مشطوف/مائل</option><option value="Stepped">متدرج</option></select>
                  </div>
                  <div>
                      <label for="corniceIntegratedLight" class="block text-sm font-medium text-gray-300 mb-1">إضاءة مدمجة</label>
                      <select id="corniceIntegratedLight" formControlName="corniceIntegratedLight" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="None">لا يوجد</option><option value="LED Profile">شريط LED</option><option value="Downlights">إضاءة سفلية (Downlights)</option></select>
                  </div>
                  <div class="text-center">
                      <label for="corniceColor" class="block text-sm font-medium text-gray-300 mb-2">اللون</label>
                      <input type="color" id="corniceColor" formControlName="corniceColor" class="w-12 h-12 rounded-full border-4 border-gray-700 cursor-pointer">
                  </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Typography -->
          <div>
            <h2 id="accordion-heading-typography">
              <button type="button" (click)="toggleAccordion('typography')" class="flex items-center justify-between w-full p-5 font-medium text-left text-gray-300 border-b border-gray-700 hover:bg-gray-700/50" [attr.aria-expanded]="activeAccordionSection() === 'typography'">
                <span class="text-xl text-purple-400 font-['Reem_Kufi']">4. الخطوط والشعار</span>
                <svg class="w-6 h-6 shrink-0 transition-transform" [class.rotate-180]="activeAccordionSection() === 'typography'" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            </h2>
            <div id="accordion-body-typography" [class.hidden]="activeAccordionSection() !== 'typography'">
              <div class="p-5 border-b border-gray-700 space-y-4">
                  <h3 class="text-lg font-semibold text-gray-400 border-b border-gray-600 pb-2">النص الرئيسي</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="md:col-span-2"><label for="mainText" class="block text-sm font-medium text-gray-300 mb-1">النص</label><input type="text" id="mainText" formControlName="mainText" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"></div>
                      <div><label for="mainTextFontType" class="block text-sm font-medium text-gray-300 mb-1">الخط</label><select id="mainTextFontType" formControlName="mainTextFontType" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="Naskh">نسخ</option><option value="Thuluth">ثلث</option><option value="Kufi">كوفي</option><option value="Freehand/Neon">حر/نيون</option><option value="Serif">مذيل (Serif)</option><option value="Sans Serif">غير مذيل (Sans Serif)</option></select></div>
                      <div><label for="mainTextLetterType" class="block text-sm font-medium text-gray-300 mb-1">نوع الحرف</label><select id="mainTextLetterType" formControlName="mainTextLetterType" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="3D Box letters">حروف ثلاثية الأبعاد (صندوق)</option><option value="Flat cut">قص مسطح</option><option value="Stencil/Cut-out">مفرغ (Stencil)</option></select></div>
                      <div><label for="mainTextMaterial" class="block text-sm font-medium text-gray-300 mb-1">المادة</label><select id="mainTextMaterial" formControlName="mainTextMaterial" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="Acrylic">أكريليك</option><option value="Stainless Steel (Gold/Silver)">ستانلس ستيل (ذهبي/فضي)</option><option value="Painted Zinc">زنك مطلي</option></select></div>
                      <div><label for="mainTextLightingType" class="block text-sm font-medium text-gray-300 mb-1">الإضاءة</label><select id="mainTextLightingType" formControlName="mainTextLightingType" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="Front-lit">إضاءة أمامية</option><option value="Back-lit/Halo">إضاءة خلفية (هالة)</option><option value="Full-lit">إضاءة كاملة</option><option value="None">لا يوجد</option></select></div>
                      <div class="text-center"><label for="mainTextColor" class="block text-sm font-medium text-gray-300 mb-2">لون الوجه</label><input type="color" id="mainTextColor" formControlName="mainTextColor" class="w-12 h-12 rounded-full border-4 border-gray-700 cursor-pointer"></div>
                      <div class="text-center"><label for="mainTextReturnColor" class="block text-sm font-medium text-gray-300 mb-2">لون الجانب</label><input type="color" id="mainTextReturnColor" formControlName="mainTextReturnColor" class="w-12 h-12 rounded-full border-4 border-gray-700 cursor-pointer"></div>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-400 border-b border-gray-600 pb-2 pt-4">النص الفرعي والشعار</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="md:col-span-2"><label for="subText" class="block text-sm font-medium text-gray-300 mb-1">النص الفرعي</label><input type="text" id="subText" formControlName="subText" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"></div>
                      <div><label for="subTextStyle" class="block text-sm font-medium text-gray-300 mb-1">نمط النص الفرعي</label><select id="subTextStyle" formControlName="subTextStyle" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="Small 3D letters">حروف ثلاثية الأبعاد صغيرة</option><option value="Vinyl sticker">ملصق فينيل</option><option value="Lightbox">صندوق إضاءة</option></select></div>
                      <div><label for="subTextPosition" class="block text-sm font-medium text-gray-300 mb-1">موضع النص الفرعي</label><select id="subTextPosition" formControlName="subTextPosition" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="Below main text">أسفل النص الرئيسي</option><option value="Right of sign">يمين اللوحة</option><option value="Left of sign">يسار اللوحة</option></select></div>
                      <div><label for="logoStyle" class="block text-sm font-medium text-gray-300 mb-1">نمط الشعار</label><select id="logoStyle" formControlName="logoStyle" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="None">لا يوجد</option><option value="3D">ثلاثي الأبعاد</option><option value="Flat print">طباعة مسطحة</option></select></div>
                      <div><label for="logoPosition" class="block text-sm font-medium text-gray-300 mb-1">موضع الشعار</label><select id="logoPosition" formControlName="logoPosition" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="Above text">أعلى النص</option><option value="Beside text">بجانب النص</option><option value="Integrated with text">مدمج مع النص</option></select></div>
                  </div>
              </div>
            </div>
          </div>

          <!-- Step 5: Structure -->
           <div>
            <h2 id="accordion-heading-structure">
              <button type="button" (click)="toggleAccordion('structure')" class="flex items-center justify-between w-full p-5 font-medium text-left text-gray-300 border-b border-gray-700 hover:bg-gray-700/50" [attr.aria-expanded]="activeAccordionSection() === 'structure'">
                <span class="text-xl text-purple-400 font-['Reem_Kufi']">5. الهيكل والإضاءة</span>
                <svg class="w-6 h-6 shrink-0 transition-transform" [class.rotate-180]="activeAccordionSection() === 'structure'" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            </h2>
            <div id="accordion-body-structure" [class.hidden]="activeAccordionSection() !== 'structure'">
               <div class="p-5 border-b border-gray-700 space-y-4">
                  <h3 class="text-lg font-semibold text-gray-400 border-b border-gray-600 pb-2">الأعمدة الجانبية</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div><label for="columnsCladding" class="block text-sm font-medium text-gray-300 mb-1">التكسية</label><select id="columnsCladding" formControlName="columnsCladding" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="None">لا يوجد</option><option value="Fully Cladded">مكسو بالكامل</option><option value="Paint only">دهان فقط</option></select></div>
                      <div><label for="columnsDesign" class="block text-sm font-medium text-gray-300 mb-1">التصميم</label><select id="columnsDesign" formControlName="columnsDesign" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="Same as main sign">نفس اللوحة الرئيسية</option><option value="Contrasting color">لون متباين</option></select></div>
                      <div class="md:col-span-2"><label for="columnsDecor" class="block text-sm font-medium text-gray-300 mb-1">الزخرفة</label><select id="columnsDecor" formControlName="columnsDecor" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="None">لا يوجد</option><option value="Vertical LED strips">شرائط LED عمودية</option><option value="Sconces">شمعدانات (Sconces)</option></select></div>
                  </div>

                  <h3 class="text-lg font-semibold text-gray-400 border-b border-gray-600 pb-2 pt-4">السقف المعلق (Soffit)</h3>
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="text-center"><label for="soffitColor" class="block text-sm font-medium text-gray-300 mb-2">اللون</label><input type="color" id="soffitColor" formControlName="soffitColor" class="w-12 h-12 rounded-full border-4 border-gray-700 cursor-pointer"></div>
                      <div><label for="soffitSpotlightsCount" class="block text-sm font-medium text-gray-300 mb-1">عدد الكشافات</label><input type="number" id="soffitSpotlightsCount" formControlName="soffitSpotlightsCount" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"></div>
                      <div class="md:col-span-2"><label for="soffitLightColorTemp" class="block text-sm font-medium text-gray-300 mb-1">درجة حرارة الإضاءة</label><select id="soffitLightColorTemp" formControlName="soffitLightColorTemp" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="Cool White">أبيض بارد</option><option value="Warm White">أبيض دافئ</option></select></div>
                  </div>

                  <h3 class="text-lg font-semibold text-gray-400 border-b border-gray-600 pb-2 pt-4">عام</h3>
                  <div><label for="openings" class="block text-sm font-medium text-gray-300 mb-1">عدد الأبواب/النوافذ</label><input type="number" id="openings" formControlName="openings" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"></div>
              </div>
            </div>
          </div>
          
           <!-- Step 6: Extras -->
          <div>
            <h2 id="accordion-heading-extras">
              <button type="button" (click)="toggleAccordion('extras')" class="flex items-center justify-between w-full p-5 font-medium text-left text-gray-300 border-b border-gray-700 hover:bg-gray-700/50" [attr.aria-expanded]="activeAccordionSection() === 'extras'">
                <span class="text-xl text-purple-400 font-['Reem_Kufi']">6. إضافات</span>
                <svg class="w-6 h-6 shrink-0 transition-transform" [class.rotate-180]="activeAccordionSection() === 'extras'" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            </h2>
            <div id="accordion-body-extras" [class.hidden]="activeAccordionSection() !== 'extras'">
              <div class="p-5 border-b border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label for="extrasScreen" class="block text-sm font-medium text-gray-300 mb-1">شاشة إلكترونية</label><select id="extrasScreen" formControlName="extrasScreen" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="None">لا يوجد</option><option value="Scrolling LED Sign">لوحة LED متحركة</option></select></div>
                  <div><label for="extrasAwning" class="block text-sm font-medium text-gray-300 mb-1">مظلة</label><select id="extrasAwning" formControlName="extrasAwning" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="None">لا يوجد</option><option value="Fabric Awning">مظلة قماشية</option><option value="Metal Awning">مظلة معدنية</option></select></div>
                  <div class="md:col-span-2"><label for="extrasWindowGraphics" class="block text-sm font-medium text-gray-300 mb-1">رسومات/ملصقات النوافذ</label><select id="extrasWindowGraphics" formControlName="extrasWindowGraphics" class="w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition"><option value="None">لا يوجد</option><option value="Yes">نعم</option></select></div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <button type="submit" [disabled]="designForm.invalid || !originalImage() || isLoading()" class="w-full font-bold py-3 px-4 rounded-lg text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-600">
             @if (isGenerating()) {
              <span class="font-['Amiri']">جاري التوليد...</span>
            } @else {
              <span class="font-['Amiri']">✨ صمم واجهتي</span>
            }
          </button>
        </div>
      </form>
    </div>

    <!-- Right Column: Display -->
    <div class="bg-gray-800 p-4 rounded-2xl shadow-2xl border border-gray-700 flex items-center justify-center min-h-[500px] lg:min-h-full">
      @if (isLoading()) {
        <div class="text-center text-gray-300">
          <svg class="animate-spin h-12 w-12 text-purple-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          @if (isGenerating()) {
            <p class="mt-4 text-lg font-medium">{{ loadingMessage() }}</p>
          } @else if (isEditing()) {
            <p class="mt-4 text-lg font-medium font-['Amiri']">جاري تطبيق التعديل...</p>
          }
        </div>
      } @else if (error()) {
        <div class="text-center text-red-400 bg-red-900/50 p-6 rounded-lg">
          <h3 class="font-bold text-lg mb-2 font-['Reem_Kufi']">فشل التوليد</h3>
          <p>{{ error() }}</p>
        </div>
      } @else if (generatedImage()) {
        <div class="w-full">
            <img [src]="generatedImage()" alt="Generated Facade Design" class="rounded-lg shadow-lg object-contain max-h-[65vh] w-full">
            
            <div class="mt-4 p-4 bg-gray-900/60 rounded-lg text-left" dir="rtl">
              <h3 class="text-base font-semibold text-purple-300 mb-2 font-['Reem_Kufi']">تحسين تصميمك</h3>
              <p class="text-xs text-gray-400 mb-3 font-['Amiri']">صف التغيير، مثل "اجعل الحروف حمراء" أو "أضف فلتر كلاسيكي".</p>
              <form [formGroup]="designForm" (ngSubmit)="onEditImage()">
                <div class="flex gap-2">
                  <input type="text" formControlName="editPrompt" placeholder="أدخل تعليمات التعديل..." class="flex-grow w-full bg-gray-700 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 transition text-sm">
                  <button type="submit" [disabled]="!designForm.get('editPrompt')?.value || isLoading()" class="font-bold py-2 px-4 rounded-lg text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-600 disabled:to-gray-600 text-sm">
                    @if (isEditing()) {
                      <span class="font-['Amiri']">جاري التطبيق...</span>
                    } @else {
                      <span class="font-['Amiri']">تطبيق التعديل</span>
                    }
                  </button>
                </div>
              </form>
            </div>

            <div class="text-center">
              <button (click)="startOver()" class="mt-4 font-bold py-2 px-6 rounded-lg text-white bg-gray-600 hover:bg-gray-500 transition-colors font-['Amiri']">البدء من جديد</button>
            </div>
        </div>
      } @else if (originalImage()) {
        <img [src]="'data:' + originalImage()!.type + ';base64,' + originalImage()!.base64" alt="Uploaded Storefront" class="rounded-lg shadow-lg object-contain max-h-[70vh] w-full">
      } @else {
        <div class="text-center text-gray-500">
          <svg class="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <p class="mt-4 text-lg font-['Amiri']">سيظهر تصميمك المولد هنا</p>
        </div>
      }
    </div>

  </div>
</main>
`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule],
})
export class AppComponent {
  private fb = inject(FormBuilder);
  private geminiService = inject(GeminiService);

  designForm: FormGroup;

  originalImage = signal<{base64: string, type: string, name: string} | null>(null);
  generatedImage = signal<string | null>(null);
  
  isGenerating = signal(false);
  isEditing = signal(false);
  isLoading = computed(() => this.isGenerating() || this.isEditing());
  activeAccordionSection = signal<string | null>('upload');

  error = signal<string | null>(null);
  loadingMessage = signal('جاري تهيئة التوليد...');

  private loadingMessages = [
    'تحليل هندسة الواجهة...',
    'تطبيق مواد جديدة...',
    'تصيير الإضاءة الافتراضية...',
    'بناء الحروف ثلاثية الأبعاد...',
    'صقل الخامات النهائية...',
    'أوشكنا على الانتهاء، جاري التصيير النهائي...'
  ];
  private messageInterval: any;

  constructor() {
    this.designForm = this.fb.group({
      // Cladding
      claddingMaterial: ['Solid', Validators.required],
      claddingFinish: ['Matte', Validators.required],
      claddingColor: ['#1E3A8A', Validators.required], // Dark Blue
      claddingPattern: ['Horizontal panels', Validators.required],
      claddingGrooveColor: ['#4B5563', Validators.required], // Gray

      // Cornice
      cornicePosition: ['Full Box', Validators.required],
      corniceShape: ['Extruded', Validators.required],
      corniceColor: ['#FBBF24', Validators.required], // Amber
      corniceIntegratedLight: ['LED Profile', Validators.required],
      
      // Main Typography
      mainText: ['My Business', Validators.required],
      mainTextFontType: ['Sans Serif', Validators.required],
      mainTextLetterType: ['3D Box letters', Validators.required],
      mainTextMaterial: ['Acrylic', Validators.required],
      mainTextLightingType: ['Front-lit', Validators.required],
      mainTextColor: ['#F9FAFB', Validators.required], // Off-white
      mainTextReturnColor: ['#9CA3AF', Validators.required], // Lighter Gray

      // Subtext & Logo
      subText: ['Quality & Service'],
      subTextPosition: ['Below main text', Validators.required],
      subTextStyle: ['Small 3D letters', Validators.required],
      logoStyle: ['None', Validators.required],
      logoPosition: ['Beside text', Validators.required],
      
      // Columns
      columnsCladding: ['None', Validators.required],
      columnsDesign: ['Same as main sign', Validators.required],
      columnsDecor: ['None', Validators.required],

      // Soffit
      soffitColor: ['#F9FAFB', Validators.required],
      soffitSpotlightsCount: [4, [Validators.required, Validators.min(0)]],
      soffitLightColorTemp: ['Warm White', Validators.required],

      // Extras
      extrasScreen: ['None', Validators.required],
      extrasAwning: ['None', Validators.required],
      extrasWindowGraphics: ['None', Validators.required],
      
      // General
      openings: [1, [Validators.required, Validators.min(0)]],
      editPrompt: ['']
    });

    effect(() => {
      if (this.isGenerating()) {
        untracked(() => this.startLoadingMessages());
      } else {
        untracked(() => this.stopLoadingMessages());
      }
    });
  }

  toggleAccordion(section: string): void {
    this.activeAccordionSection.set(this.activeAccordionSection() === section ? null : section);
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result.split(',')[1];
        this.originalImage.set({ base64: base64, type: file.type, name: file.name });
        this.generatedImage.set(null);
        this.error.set(null);
        this.activeAccordionSection.set('cladding'); // Move to next step
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.designForm.invalid || !this.originalImage()) {
      this.error.set('Please fill out all required fields and upload an image.');
      return;
    }

    this.isGenerating.set(true);
    this.generatedImage.set(null);
    this.error.set(null);

    const params = this.designForm.value as DesignParameters;
    const { base64, type } = this.originalImage()!;

    try {
      const generatedBase64 = await this.geminiService.generateFacade(params, base64, type);
      this.generatedImage.set(`data:image/jpeg;base64,${generatedBase64}`);
    } catch (err) {
      this.error.set(typeof err === 'string' ? err : 'An unexpected error occurred.');
    } finally {
      this.isGenerating.set(false);
    }
  }

  async onEditImage(): Promise<void> {
    const prompt = this.designForm.get('editPrompt')?.value;
    if (!prompt || !this.generatedImage()) {
      this.error.set('Please enter an edit instruction.');
      return;
    }

    this.isEditing.set(true);
    this.error.set(null);

    const fullDataUrl = this.generatedImage()!;
    const parts = fullDataUrl.split(',');
    const meta = parts[0];
    const base64 = parts[1];
    const mimeType = meta.split(':')[1].split(';')[0];

    try {
      const editedBase64 = await this.geminiService.editImage(base64, mimeType, prompt);
      this.generatedImage.set(`data:image/jpeg;base64,${editedBase64}`);
      this.designForm.get('editPrompt')?.setValue('');
    } catch (err) {
      this.error.set(typeof err === 'string' ? err : 'An unexpected error occurred during editing.');
    } finally {
      this.isEditing.set(false);
    }
  }
  
  startOver(): void {
    this.originalImage.set(null);
    this.generatedImage.set(null);
    this.error.set(null);
    this.isGenerating.set(false);
    this.isEditing.set(false);
    this.activeAccordionSection.set('upload');
    this.designForm.get('editPrompt')?.setValue('');
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  private startLoadingMessages(): void {
    let index = 0;
    this.loadingMessage.set(this.loadingMessages[index]);
    this.messageInterval = setInterval(() => {
      index = (index + 1) % this.loadingMessages.length;
      this.loadingMessage.set(this.loadingMessages[index]);
    }, 3000);
  }

  private stopLoadingMessages(): void {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }
  }
}
