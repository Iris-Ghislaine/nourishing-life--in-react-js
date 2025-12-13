import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/appStore';
import type { Disease, MealCategory } from '../types';

export const AdminDiseaseManager = () => {
  const { diseases, meals, addDisease, addMeal, updateDisease, deleteDisease, deleteMeal, settings } = useAppStore();
  const [showAddDisease, setShowAddDisease] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedDiseaseId, setSelectedDiseaseId] = useState('');
  const [editingDisease, setEditingDisease] = useState<string | null>(null);

  const [diseaseForm, setDiseaseForm] = useState({
    name: '',
    description: '',
    icon: '',
    color: 'from-blue-500 to-cyan-600',
    didYouKnow: ['']
  });

  const [mealForm, setMealForm] = useState({
    diseaseId: '',
    category: 'breakfast' as MealCategory,
    name: '',
    description: '',
    image: '',
    preparationSteps: [''],
    nutrients: { calories: '', protein: '', carbs: '', fats: '' },
    benefits: ['']
  });

  const handleAddDisease = () => {
    if (!diseaseForm.name.trim() || !diseaseForm.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const filteredFacts = diseaseForm.didYouKnow.filter(item => item.trim() !== '');
    
    addDisease({
      ...diseaseForm,
      name: diseaseForm.name.trim(),
      description: diseaseForm.description.trim(),
      didYouKnow: filteredFacts.length > 0 ? filteredFacts : ['No facts available']
    });

    toast.success('Disease added successfully!');
    setDiseaseForm({ name: '', description: '', icon: '', color: 'from-blue-500 to-cyan-600', didYouKnow: [''] });
    setShowAddDisease(false);
  };

  const handleAddMeal = () => {
    if (!mealForm.name.trim() || !mealForm.description.trim() || !mealForm.diseaseId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const filteredSteps = mealForm.preparationSteps.filter(step => step.trim() !== '');
    const filteredBenefits = mealForm.benefits.filter(benefit => benefit.trim() !== '');
    
    addMeal({
      ...mealForm,
      name: mealForm.name.trim(),
      description: mealForm.description.trim(),
      preparationSteps: filteredSteps.length > 0 ? filteredSteps : ['No preparation steps provided'],
      benefits: filteredBenefits.length > 0 ? filteredBenefits : ['No benefits listed']
    });

    toast.success('Meal added successfully!');
    setMealForm({
      diseaseId: '',
      category: 'breakfast',
      name: '',
      description: '',
      image: '',
      preparationSteps: [''],
      nutrients: { calories: '', protein: '', carbs: '', fats: '' },
      benefits: ['']
    });
    setShowAddMeal(false);
  };

  const handleDeleteDisease = (id: string) => {
    if (window.confirm('Are you sure? This will delete all meals for this disease.')) {
      deleteDisease(id);
      toast.success('Disease deleted successfully!');
    }
  };

  const addArrayField = (field: 'didYouKnow' | 'preparationSteps' | 'benefits', isDisease = true) => {
    if (isDisease) {
      setDiseaseForm(prev => ({
        ...prev,
        [field]: [...prev[field as keyof typeof prev] as string[], '']
      }));
    } else {
      setMealForm(prev => ({
        ...prev,
        [field]: [...prev[field as keyof typeof prev] as string[], '']
      }));
    }
  };

  const updateArrayField = (field: 'didYouKnow' | 'preparationSteps' | 'benefits', index: number, value: string, isDisease = true) => {
    if (isDisease) {
      setDiseaseForm(prev => ({
        ...prev,
        [field]: (prev[field as keyof typeof prev] as string[]).map((item, i) => i === index ? value : item)
      }));
    } else {
      setMealForm(prev => ({
        ...prev,
        [field]: (prev[field as keyof typeof prev] as string[]).map((item, i) => i === index ? value : item)
      }));
    }
  };

  const removeArrayField = (field: 'didYouKnow' | 'preparationSteps' | 'benefits', index: number, isDisease = true) => {
    if (isDisease) {
      setDiseaseForm(prev => ({
        ...prev,
        [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
      }));
    } else {
      setMealForm(prev => ({
        ...prev,
        [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className={`p-6 ${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Disease & Meal Management</h2>

        {/* Disease Management */}
        <div className={`mb-8 p-6 rounded-xl ${settings.darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold">Diseases</h3>
            <button
              onClick={() => setShowAddDisease(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add Disease
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {diseases.map((disease) => (
              <motion.div
                key={disease.id}
                className={`p-4 rounded-lg border ${settings.darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{disease.icon}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingDisease(disease.id)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDisease(disease.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h4 className="font-semibold">{disease.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{disease.description}</p>
                <p className="text-xs mt-2">
                  {meals.filter(m => m.diseaseId === disease.id).length} meals
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Meal Management */}
        <div className={`mb-8 p-6 rounded-xl ${settings.darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-semibold">Meals</h3>
            <button
              onClick={() => setShowAddMeal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-4 h-4" />
              Add Meal
            </button>
          </div>

          <div className="mb-4">
            <select
              value={selectedDiseaseId}
              onChange={(e) => setSelectedDiseaseId(e.target.value)}
              className={`px-3 py-2 rounded-lg border ${
                settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
            >
              <option value="">All Diseases</option>
              {diseases.map(disease => (
                <option key={disease.id} value={disease.id}>{disease.name}</option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {meals
              .filter(meal => !selectedDiseaseId || meal.diseaseId === selectedDiseaseId)
              .map((meal) => (
                <motion.div
                  key={meal.id}
                  className={`p-4 rounded-lg border ${settings.darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 text-xs rounded ${
                      meal.category === 'breakfast' ? 'bg-yellow-100 text-yellow-800' :
                      meal.category === 'lunch' ? 'bg-green-100 text-green-800' :
                      meal.category === 'dinner' ? 'bg-blue-100 text-blue-800' :
                      meal.category === 'snacks' ? 'bg-purple-100 text-purple-800' :
                      meal.category === 'drinks' ? 'bg-cyan-100 text-cyan-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {meal.category}
                    </span>
                    <button
                      onClick={() => deleteMeal(meal.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h4 className="font-semibold mb-1">{meal.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{meal.description}</p>
                  <p className="text-xs">
                    {diseases.find(d => d.id === meal.diseaseId)?.name}
                  </p>
                </motion.div>
              ))}
          </div>
        </div>

        {/* Add Disease Modal */}
        {showAddDisease && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`w-full max-w-2xl p-6 rounded-2xl shadow-2xl ${
                settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white'
              } max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Add New Disease</h3>
                <button
                  onClick={() => setShowAddDisease(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Disease Name *</label>
                  <input
                    type="text"
                    value={diseaseForm.name}
                    onChange={(e) => setDiseaseForm(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                    placeholder="e.g., Diabetes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    value={diseaseForm.description}
                    onChange={(e) => setDiseaseForm(prev => ({ ...prev, description: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                    rows={3}
                    placeholder="Brief description of the disease"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Icon (Emoji)</label>
                  <input
                    type="text"
                    value={diseaseForm.icon}
                    onChange={(e) => setDiseaseForm(prev => ({ ...prev, icon: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                    placeholder="🩸"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Color Gradient</label>
                  <select
                    value={diseaseForm.color}
                    onChange={(e) => setDiseaseForm(prev => ({ ...prev, color: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                    }`}
                  >
                    <option value="from-blue-500 to-cyan-600">Blue to Cyan</option>
                    <option value="from-red-500 to-pink-600">Red to Pink</option>
                    <option value="from-green-500 to-emerald-600">Green to Emerald</option>
                    <option value="from-purple-500 to-violet-600">Purple to Violet</option>
                    <option value="from-orange-500 to-yellow-600">Orange to Yellow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Did You Know Facts</label>
                  {diseaseForm.didYouKnow.map((fact, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={fact}
                        onChange={(e) => updateArrayField('didYouKnow', index, e.target.value, true)}
                        className={`flex-1 px-3 py-2 rounded-lg border ${
                          settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                        }`}
                        placeholder="Enter a fact about this disease"
                      />
                      <button
                        onClick={() => removeArrayField('didYouKnow', index, true)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayField('didYouKnow', true)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    + Add Fact
                  </button>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleAddDisease}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Disease
                  </button>
                  <button
                    onClick={() => setShowAddDisease(false)}
                    className="px-6 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Meal Modal */}
        {showAddMeal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`w-full max-w-4xl p-6 rounded-2xl shadow-2xl ${
                settings.darkMode ? 'bg-gray-800 text-white' : 'bg-white'
              } max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Add New Meal</h3>
                <button
                  onClick={() => setShowAddMeal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Disease *</label>
                    <select
                      value={mealForm.diseaseId}
                      onChange={(e) => setMealForm(prev => ({ ...prev, diseaseId: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    >
                      <option value="">Select Disease</option>
                      {diseases.map(disease => (
                        <option key={disease.id} value={disease.id}>{disease.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      value={mealForm.category}
                      onChange={(e) => setMealForm(prev => ({ ...prev, category: e.target.value as MealCategory }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                    >
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snacks">Snacks</option>
                      <option value="drinks">Drinks</option>
                      <option value="vitamins">Vitamins</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Meal Name *</label>
                    <input
                      type="text"
                      value={mealForm.name}
                      onChange={(e) => setMealForm(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                      placeholder="e.g., African Millet Porridge"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Description *</label>
                    <textarea
                      value={mealForm.description}
                      onChange={(e) => setMealForm(prev => ({ ...prev, description: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                      rows={3}
                      placeholder="Brief description of the meal"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <input
                      type="url"
                      value={mealForm.image}
                      onChange={(e) => setMealForm(prev => ({ ...prev, image: e.target.value }))}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                      }`}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nutrients</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={mealForm.nutrients.calories}
                        onChange={(e) => setMealForm(prev => ({ 
                          ...prev, 
                          nutrients: { ...prev.nutrients, calories: e.target.value }
                        }))}
                        className={`px-3 py-2 rounded-lg border ${
                          settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                        }`}
                        placeholder="Calories"
                      />
                      <input
                        type="text"
                        value={mealForm.nutrients.protein}
                        onChange={(e) => setMealForm(prev => ({ 
                          ...prev, 
                          nutrients: { ...prev.nutrients, protein: e.target.value }
                        }))}
                        className={`px-3 py-2 rounded-lg border ${
                          settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                        }`}
                        placeholder="Protein"
                      />
                      <input
                        type="text"
                        value={mealForm.nutrients.carbs}
                        onChange={(e) => setMealForm(prev => ({ 
                          ...prev, 
                          nutrients: { ...prev.nutrients, carbs: e.target.value }
                        }))}
                        className={`px-3 py-2 rounded-lg border ${
                          settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                        }`}
                        placeholder="Carbs"
                      />
                      <input
                        type="text"
                        value={mealForm.nutrients.fats}
                        onChange={(e) => setMealForm(prev => ({ 
                          ...prev, 
                          nutrients: { ...prev.nutrients, fats: e.target.value }
                        }))}
                        className={`px-3 py-2 rounded-lg border ${
                          settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                        }`}
                        placeholder="Fats"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Preparation Steps</label>
                    {mealForm.preparationSteps.map((step, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={step}
                          onChange={(e) => updateArrayField('preparationSteps', index, e.target.value, false)}
                          className={`flex-1 px-3 py-2 rounded-lg border ${
                            settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                          }`}
                          placeholder={`Step ${index + 1}`}
                        />
                        <button
                          onClick={() => removeArrayField('preparationSteps', index, false)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayField('preparationSteps', false)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      + Add Step
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Benefits</label>
                    {mealForm.benefits.map((benefit, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => updateArrayField('benefits', index, e.target.value, false)}
                          className={`flex-1 px-3 py-2 rounded-lg border ${
                            settings.darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                          }`}
                          placeholder="Enter a benefit"
                        />
                        <button
                          onClick={() => removeArrayField('benefits', index, false)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayField('benefits', false)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      + Add Benefit
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-6">
                <button
                  onClick={handleAddMeal}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Meal
                </button>
                <button
                  onClick={() => setShowAddMeal(false)}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};