import React, { useState } from 'react';
import {
  User, Mail, Phone, Calendar, BookOpen, GraduationCap, MapPin, Upload, Save, X
} from 'lucide-react';

type StudentFormData = {
  [key: string]: string;
};

type StudentRegisterFormProps = {
  onClose: () => void;
  onSubmit: (data: StudentFormData) => Promise<void> | void;
};

export default function StudentRegisterForm({ onClose, onSubmit }: StudentRegisterFormProps) {
  const [formData, setFormData] = useState<StudentFormData>({
    first_name: '', last_name: '', email: '', phone: '', date_of_birth: '',
    address: '', city: '', zip_code: '', parent_name: '', parent_phone: '',
    parent_email: '', student_type: '', enrollment_type: '', session_type: '',
    start_date: '', priority_level: '', application_source: '', subject: '',
    grade: '', previous_education: '', learning_goals: '', preferred_schedule: '',
    special_needs: ''
  });

  const [profile_image_url, setprofile_image_url] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<StudentFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const student_types = ['New Student', 'Returning Student', 'Transfer Student', 'International Student'];
  const enrollment_types = ['Regular Tutoring', 'Intensive Course', 'Exam Preparation', 'Summer Program', 'Remedial Support', 'Advanced Learning', 'Test Prep (SAT/ACT)', 'Language Learning'];
  const session_types = ['One-on-One', 'Small Group (2-4 students)', 'Group Class (5+ students)', 'Online Sessions', 'Hybrid (Online + In-person)', 'Workshop Style'];
  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Literature', 'History', 'Geography', 'Computer Science', 'Art'];
  const grades = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'A/L', 'University'];
  const scheduleOptions = ['Weekday Mornings', 'Weekday Afternoons', 'Weekday Evenings', 'Weekend Mornings', 'Weekend Afternoons', 'Flexible'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setprofile_image_url(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<StudentFormData> = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.date_of_birth) newErrors.date_of_birth = 'Date of birth is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.grade) newErrors.grade = 'Grade is required';
    if (!formData.parent_name.trim()) newErrors.parent_name = 'Parent/Guardian name is required';
    if (!formData.parent_phone.trim()) newErrors.parent_phone = 'Parent/Guardian phone is required';
    if (!formData.student_type) newErrors.student_type = 'Student type is required';
    if (!formData.enrollment_type) newErrors.enrollment_type = 'Enrollment type is required';
    if (!formData.session_type) newErrors.session_type = 'Session type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Include profile image in form data if available
        const submissionData = {
          ...formData,
          profile_image_url: profile_image_url || ''
        };
        
        console.log('Form submitted:', submissionData);
        
        // Call the onSubmit prop with the form data
        await onSubmit(submissionData);
        
        // Reset form after successful submission
        setFormData({
          first_name: '', last_name: '', email: '', phone: '', date_of_birth: '',
          address: '', city: '', zip_code: '', parent_name: '', parent_phone: '',
          parent_email: '', student_type: '', enrollment_type: '', session_type: '',
          start_date: '', priority_level: '', application_source: '', subject: '',
          grade: '', previous_education: '', learning_goals: '', preferred_schedule: '',
          special_needs: ''
        });
        setprofile_image_url(null);
        setErrors({});
        
        alert('Student registered successfully!');
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error registering student. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleReset = () => {
    setFormData({
      first_name: '', last_name: '', email: '', phone: '', date_of_birth: '',
      address: '', city: '', zip_code: '', parent_name: '', parent_phone: '',
      parent_email: '', student_type: '', enrollment_type: '', session_type: '',
      start_date: '', priority_level: '', application_source: '', subject: '',
      grade: '', previous_education: '', learning_goals: '', preferred_schedule: '',
      special_needs: ''
    });
    setprofile_image_url(null);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Student Registration</h1>
          <p className="text-gray-400">Join our tutoring program and start your learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Picture Section */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <User className="mr-2" size={24} />
                Profile Picture
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                  {profile_image_url ? (
                    <img src={profile_image_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                  <Upload size={16} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <p className="text-white font-medium">Upload Profile Picture</p>
                <p className="text-gray-400 text-sm">JPG, PNG or GIF (max 5MB)</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <User className="mr-2" size={24} />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700 border ${errors['first_name'] ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors`}
                  placeholder="Enter first name"
                />
                {errors['first_name'] && <p className="text-red-400 text-sm mt-1">{errors['first_name']}</p>}
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700 border ${errors['last_name'] ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors`}
                  placeholder="Enter last name"
                />
                {errors['last_name'] && <p className="text-red-400 text-sm mt-1">{errors['last_name']}</p>}
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Email Address *</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700 border ${errors['email'] ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors`}
                    placeholder="student@email.com"
                  />
                </div>
                {errors['email'] && <p className="text-red-400 text-sm mt-1">{errors['email']}</p>}
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700 border ${errors['phone'] ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors`}
                    placeholder="+94 77 123 4567"
                  />
                </div>
                {errors['phone'] && <p className="text-red-400 text-sm mt-1">{errors['phone']}</p>}
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Date of Birth *</label>
                <div className="relative">
                  <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700 border ${errors['date_of_birth'] ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors`}
                  />
                </div>
                {errors['date_of_birth'] && <p className="text-red-400 text-sm mt-1">{errors['date_of_birth']}</p>}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <MapPin className="mr-2" size={24} />
              Address Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">Street Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Enter street address"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Zip Code</label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Enter zip code"
                />
              </div>
            </div>
          </div>

          {/* Parent/Guardian Information */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <User className="mr-2" size={24} />
              Parent/Guardian Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Parent/Guardian Name *</label>
                <input
                  type="text"
                  name="parent_name"
                  value={formData.parent_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700 border ${errors['parent_name'] ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors`}
                  placeholder="Enter parent/guardian name"
                />
                {errors['parent_name'] && <p className="text-red-400 text-sm mt-1">{errors['parent_name']}</p>}
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Parent/Guardian Phone *</label>
                <div className="relative">
                  <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="parent_phone"
                    value={formData.parent_phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-700 border ${errors['parent_phone'] ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors`}
                    placeholder="+94 77 123 4567"
                  />
                </div>
                {errors['parent_phone'] && <p className="text-red-400 text-sm mt-1">{errors['parent_phone']}</p>}
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Parent/Guardian Email</label>
                <div className="relative">
                  <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="parent_email"
                    value={formData.parent_email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="parent@email.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Student Type & Enrollment */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <GraduationCap className="mr-2" size={24} />
              Student Type & Enrollment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Student Type *</label>
                <select
                  name="student_type"
                  value={formData.student_type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700 border ${errors['student_type'] ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors`}
                >
                  <option value="">Select student type</option>
                  {student_types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors['student_type'] && <p className="text-red-400 text-sm mt-1">{errors['student_type']}</p>}
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Enrollment Type *</label>
                <select
                  name="enrollment_type"
                  value={formData.enrollment_type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700 border ${errors['enrollment_type'] ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors`}
                >
                  <option value="">Select enrollment type</option>
                  {enrollment_types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors['enrollment_type'] && <p className="text-red-400 text-sm mt-1">{errors['enrollment_type']}</p>}
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Preferred Session Type *</label>
                <select
                  name="session_type"
                  value={formData.session_type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700 border ${errors['session_type'] ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors`}
                >
                  <option value="">Select session type</option>
                  {session_types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors['session_type'] && <p className="text-red-400 text-sm mt-1">{errors['session_type']}</p>}
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Expected Start Date</label>
                <div className="relative">
                  <Calendar size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
            
            {/* Priority Level & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Priority Level</label>
                <select
                  name="priority_level"
                  value={formData.priority_level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">Select priority level</option>
                  <option value="Standard">Standard</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">Urgent</option>
                  <option value="VIP">VIP Student</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Application Source</label>
                <select
                  name="application_source"
                  value={formData.application_source}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">How did you hear about us?</option>
                  <option value="Website">Website</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Referral">Friend/Family Referral</option>
                  <option value="Advertisement">Advertisement</option>
                  <option value="School">School Recommendation</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <BookOpen className="mr-2" size={24} />
              Academic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Subject of Interest *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700 border ${errors['subject'] ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors`}
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
                {errors['subject'] && <p className="text-red-400 text-sm mt-1">{errors['subject']}</p>}
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Current Grade *</label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-gray-700 border ${errors['grade'] ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors`}
                >
                  <option value="">Select grade level</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
                {errors['grade'] && <p className="text-red-400 text-sm mt-1">{errors['grade']}</p>}
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Preferred Schedule</label>
                <select
                  name="preferred_schedule"
                  value={formData.preferred_schedule}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="">Select preferred schedule</option>
                  {scheduleOptions.map(schedule => (
                    <option key={schedule} value={schedule}>{schedule}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Previous Education</label>
                <input
                  type="text"
                  name="previous_education"
                  value={formData.previous_education}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Previous school or education background"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">Learning Goals</label>
                <textarea
                  name="learning_goals"
                  value={formData.learning_goals}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  placeholder="What are your learning goals and expectations?"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">Special Needs or Accommodations</label>
                <textarea
                  name="special_needs"
                  value={formData.special_needs}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  placeholder="Any special learning needs, disabilities, or accommodations required"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <X size={20} />
              <span>Reset Form</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Save size={20} />
           {isSubmitting ? 'Submitting...' : 'Reset Form'}
</button>
<div/>
</div></form></div></div> );
 }