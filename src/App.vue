<script setup>
import { ref, onMounted } from 'vue';
import api from './api'; 

const dataList = ref([]);
const formData = ref({ name: '', specialization_id: '' });

const loadData = async () => {
  try {
    const res = await api.get('/Doctors'); 
    dataList.value = res.data;
  } catch (e) { 
    console.error("خطأ في جلب البيانات:", e); 
  }
};

const handleSave = async () => {
  const specId = parseInt(formData.value.specialization_id);
  
  const doctorObject = {
    name: formData.value.name,
    specializationId: specId, // احتمال 1 (C# Standard)
    specialization_id: specId, // احتمال 2 (Laravel/JS Standard)
    spec_id: specId,           // احتمال 3 (كما في pgAdmin)
    specialization: null       // لإلغاء شرط الـ Required إذا وجد
  };

  try {
    await api.post('/Doctors', doctorObject);
    alert("أخيراً! تم الحفظ بنجاح 💃🎉");
    loadData();
  } catch (e) {
    console.error("الخادم رفض الطلب لهذه الأسباب:", e.response?.data);
    alert();
  }
};
const handleDelete = async (id) => {
  if (confirm("هل تريد حذف هذا الطبيب؟")) {
    try {
      await api.delete('/Doctors/' + id); 
      loadData();
    } catch (e) {
      console.error("فشل الحذف:", e);
      alert("فشل الحذف، قد يكون الطبيب مرتبطاً بسجلات أخرى");
    }
  }
};

onMounted(loadData);
</script>

<template>
  <div style="direction: rtl; padding: 20px; font-family: sans-serif; max-width: 900px; margin: auto;">
    
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2c3e50;">نظام إدارة أطباء المستشفى 🏥</h1>
      <p style="color: #7f8c8d;"> ربط قاعدة بيانات PostgreSQL</p>
    </div>

    <div style="background: #fdfdfd; padding: 25px; border-radius: 12px; border: 1px solid #e0e0e0; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 30px;">
      <h3 style="margin-top: 0; color: #34495e;">تسجيل طبيب جديد</h3>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <input 
          v-model="formData.name" 
          placeholder="اسم الطبيب" 
          style="flex: 2; min-width: 200px; padding: 12px; border: 1px solid #ccc; border-radius: 6px;" 
        />
        <input 
          v-model="formData.specialization_id" 
          type="number" 
          placeholder="رقم التخصص (ID)" 
          style="flex: 1; min-width: 150px; padding: 12px; border: 1px solid #ccc; border-radius: 6px;" 
        />
        <button @click="handleSave" style="padding: 12px 30px; background: #27ae60; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
          حفظ البيانات
        </button>
      </div>
    </div>
    
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <thead>
          <tr style="background: #34495e; color: white; text-align: right;">
            <th style="padding: 15px;">رقم الطبيب</th>
            <th style="padding: 15px;">الاسم</th>
            <th style="padding: 15px;">رقم التخصص</th>
            <th style="padding: 15px; text-align: center;">العمليات</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in dataList" :key="d.doctor_id" style="border-bottom: 1px solid #eee;">
            <td style="padding: 15px;">{{ d.doctor_id }}</td>
            <td style="padding: 15px;">{{ d.name }}</td>
            <td style="padding: 15px;">{{ d.specialization_id }}</td>
            <td style="padding: 15px; text-align: center;">
              <button @click="handleDelete(d.doctor_id)" style="background: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">حذف</button>
            </td>
          </tr>
          <tr v-if="dataList.length === 0">
            <td colspan="4" style="padding: 30px; text-align: center; color: #95a5a6;">لا توجد بيانات حالياً.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
button:hover { filter: brightness(1.1); }
tr:hover { background-color: #f9f9f9; }
</style>