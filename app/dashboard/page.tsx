'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
  TrendingUp,
  DollarSign,
  Clock,
  MapPin,
  Phone,
  Mail,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Star,
  Award,
  Target,
  LucideIcon,
  Settings,
  FolderOpen,
  Globe,
  Github,
  HelpCircle,
  LogOut,
  ChevronDown,
  Home,
  Database,
  Image,
  BarChart3,
  Shield,
  Package,
  RefreshCw,
  Zap,
  Users2,
  FileText,
  Layers,
  Grid3X3,
} from 'lucide-react';
import Link from 'next/link';
import StudentRegister from './components/StudentRegisterForm';
import { createClient } from '@/lib/supabase/client';
import { Trash2, Eye } from 'lucide-react';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  address: string;
  phone: string;
  city: string;
}

interface TabButtonProps {
  id: ActiveTab;
  label: string;
  icon: LucideIcon;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
}

interface Students {
  id: number;
  name: string;
  subject: string;
  tutor: string;
  nextClass: string;
  grade: string;
}

interface Tutor {
  id: number;
  name: string;
  subject: string;
  students: number;
  rating: number;
  experience: string;
}

interface ScheduleSession {
  time: string;
  student: string;
  tutor: string;
  subject: string;
  location: string;
}

interface DashboardStats {
  totalStudents: number;
  activeTutors: number;
  todayClasses: number;
  monthlyRevenue: number;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
}

type ActiveTab = 'overview' | 'students' | 'tutors' | 'schedule' | 'subjects';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [activeSidebarItem, setActiveSidebarItem] =
    useState<string>('overview');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [showForm, setShowForm] = useState(false);
  // Sidebar navigation items
  const sidebarItems: SidebarItem[] = [
    { id: 'home', label: 'Project overview', icon: Home },
    { id: 'table-editor', label: 'Table Editor', icon: Grid3X3 },
    { id: 'sql-editor', label: 'SQL Editor', icon: Database },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'auth', label: 'Authentication', icon: Shield, isActive: true },
    { id: 'storage', label: 'Storage', icon: Package },
    { id: 'edge-functions', label: 'Edge Functions', icon: Zap },
    { id: 'realtime', label: 'Realtime', icon: RefreshCw },
    { id: 'advisors', label: 'Advisors', icon: Users2 },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'api-docs', label: 'API Docs', icon: FileText },
    { id: 'integrations', label: 'Integrations', icon: Layers },
    { id: 'settings', label: 'Project Settings', icon: Settings },
  ];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id: number) => {
    const supabase = createClient();

    const { error } = await supabase.from('students').delete().eq('id', id);

    if (error) {
      console.error('Delete failed:', error.message);
    } else {
      console.log(`Deleted country with id ${id}`);
      // Optionally, refresh your data or remove the item from local state
    }
  };

  // useEffect(() => {
  //   const fetchStudents = async () => {
  //     const supabase = await createClient();

  //     try {
  //       setLoading(true);
  //       const { data, error } = await supabase
  //         .from('students')
  //         .select('*')
  //         .order('id', { ascending: false });

  //       if (error) {
  //         throw error;
  //       }

  //       // Transform the data to match your component's expected format
  //       const transformedStudents =
  //         data?.map((student: Student) => ({
  //           id: student.id,
  //           first_name: student.first_name,
  //           last_name: student.last_name,
  //           email: student.email,
  //           phone: student.phone,
  //           date_of_birth: student.date_of_birth,
  //           address: student.address,
  //           city: student.city,
  //         })) || [];

  //       setStudentsData(transformedStudents);
  //     } catch (err) {
  //       // setError(err.message);
  //       console.error('Error fetching students:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchStudents();
  // }, []);

  // Close menu when clicking outside

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchStudents();
    }, 300); // wait for typing to finish

    return () => clearTimeout(timeout);
  }, [searchTerm]);
  
  const fetchStudents = async () => {
    const supabase = createClient();
    setLoading(true);

    try {
      let query = supabase
        .from('students')
        .select('*')
        .order('id', { ascending: false });

      if (searchTerm.trim()) {
        // Use ilike for case-insensitive matching
        query = query.or(
          `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      const transformedStudents =
        data?.map((student: Student) => ({
          id: student.id,
          first_name: student.first_name,
          last_name: student.last_name,
          email: student.email,
          phone: student.phone,
          date_of_birth: student.date_of_birth,
          address: student.address,
          city: student.city,
        })) || [];

      setStudentsData(transformedStudents);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock data

  // In your component

  // const handleDelete = async (id) => {
  //   try {
  //     const { error } = await supabase
  //       .from('countries') // replace with your table name
  //       .delete()
  //       .eq('id', id)

  //     if (error) {
  //       console.error('Error deleting:', error)
  //       alert('Error deleting record')
  //     } else {
  //       // Remove from local state or refresh data
  //       setCountries(countries.filter(item => item.id !== id))
  //       // Or refresh the data
  //       // fetchData()
  //     }
  //   } catch (error) {
  //     console.error('Error:', error)
  //   }
  // }

  const stats: DashboardStats = {
    totalStudents: 156,
    activeTutors: 24,
    todayClasses: 18,
    monthlyRevenue: 12450,
  };

  const recentStudents: Students[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      subject: 'Mathematics',
      tutor: 'Dr. Smith',
      nextClass: '2:00 PM',
      grade: 'A',
    },
    {
      id: 2,
      name: 'Mike Chen',
      subject: 'Physics',
      tutor: 'Prof. Wilson',
      nextClass: '3:30 PM',
      grade: 'B+',
    },
    {
      id: 3,
      name: 'Emma Davis',
      subject: 'Chemistry',
      tutor: 'Dr. Brown',
      nextClass: '4:00 PM',
      grade: 'A-',
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      subject: 'Biology',
      tutor: 'Dr. Taylor',
      nextClass: '5:00 PM',
      grade: 'B',
    },
    {
      id: 5,
      name: 'Jennifer Liu',
      subject: 'Mathematics',
      tutor: 'Dr. Smith',
      nextClass: '6:00 PM',
      grade: 'A+',
    },
    {
      id: 6,
      name: 'David Kim',
      subject: 'Physics',
      tutor: 'Prof. Wilson',
      nextClass: '7:00 PM',
      grade: 'B',
    },
    {
      id: 7,
      name: 'Maria Garcia',
      subject: 'Chemistry',
      tutor: 'Dr. Brown',
      nextClass: '8:00 PM',
      grade: 'A-',
    },
    {
      id: 8,
      name: 'James Wilson',
      subject: 'Biology',
      tutor: 'Dr. Taylor',
      nextClass: '9:00 PM',
      grade: 'B+',
    },
  ];

  const tutors: Tutor[] = [
    {
      id: 1,
      name: 'Dr. Smith',
      subject: 'Mathematics',
      students: 12,
      rating: 4.9,
      experience: '8 years',
    },
    {
      id: 2,
      name: 'Prof. Wilson',
      subject: 'Physics',
      students: 8,
      rating: 4.8,
      experience: '12 years',
    },
    {
      id: 3,
      name: 'Dr. Brown',
      subject: 'Chemistry',
      students: 10,
      rating: 4.7,
      experience: '6 years',
    },
    {
      id: 4,
      name: 'Dr. Taylor',
      subject: 'Biology',
      students: 15,
      rating: 4.9,
      experience: '10 years',
    },
    {
      id: 5,
      name: 'Prof. Anderson',
      subject: 'Computer Science',
      students: 18,
      rating: 4.8,
      experience: '15 years',
    },
    {
      id: 6,
      name: 'Dr. Martinez',
      subject: 'English',
      students: 14,
      rating: 4.6,
      experience: '9 years',
    },
  ];

  const todaySchedule: ScheduleSession[] = [
    {
      time: '9:00 AM',
      student: 'John Doe',
      tutor: 'Dr. Smith',
      subject: 'Algebra',
      location: 'Room A1',
    },
    {
      time: '10:30 AM',
      student: 'Lisa Wang',
      tutor: 'Prof. Wilson',
      subject: 'Mechanics',
      location: 'Room B2',
    },
    {
      time: '2:00 PM',
      student: 'Sarah Johnson',
      tutor: 'Dr. Smith',
      subject: 'Calculus',
      location: 'Room A1',
    },
    {
      time: '3:30 PM',
      student: 'Mike Chen',
      tutor: 'Prof. Wilson',
      subject: 'Optics',
      location: 'Room B2',
    },
    {
      time: '4:00 PM',
      student: 'Emma Davis',
      tutor: 'Dr. Brown',
      subject: 'Organic Chemistry',
      location: 'Room C3',
    },
    {
      time: '5:00 PM',
      student: 'Alex Rodriguez',
      tutor: 'Dr. Taylor',
      subject: 'Genetics',
      location: 'Room D4',
    },
    {
      time: '6:00 PM',
      student: 'Jennifer Liu',
      tutor: 'Dr. Smith',
      subject: 'Statistics',
      location: 'Room A1',
    },
    {
      time: '7:00 PM',
      student: 'David Kim',
      tutor: 'Prof. Wilson',
      subject: 'Thermodynamics',
      location: 'Room B2',
    },
  ];

  const SidebarItem: React.FC<{ item: SidebarItem }> = ({ item }) => (
    <button
      onClick={() => setActiveSidebarItem(item.id)}
      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors text-sm ${
        activeSidebarItem === item.id || item.isActive
          ? 'bg-gray-700 text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      <item.icon size={18} />
      <span>{item.label}</span>
    </button>
  );

  const TabButton: React.FC<TabButtonProps> = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
        activeTab === id
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-400 hover:text-white hover:bg-gray-700'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
  }) => (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp size={16} className="text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">
                {trend}
              </span>
            </div>
          )}
        </div>
        <div className="bg-blue-600 rounded-lg p-3">
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
  console.log('object', showForm);

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          trend="+12% this month"
        />
        <StatCard
          title="Active Tutors"
          value={stats.activeTutors}
          icon={GraduationCap}
          trend="+2 new"
        />
        <StatCard
          title="Today's Classes"
          value={stats.todayClasses}
          icon={Calendar}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+8.5%"
        />
      </div>

      {/* Recent Activity & Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              Recent Students
            </h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View All
            </button>
          </div>
          {/* Scrollable container for students */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <div className="space-y-4 pr-2">
              {recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {student.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{student.name}</p>
                      <p className="text-gray-400 text-sm">
                        {student.subject} • {student.tutor}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-medium">
                      {student.grade}
                    </p>
                    <p className="text-gray-400 text-sm">{student.nextClass}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              Today's Schedule
            </h3>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              View Calendar
            </button>
          </div>
          {/* Scrollable container for schedule */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <div className="space-y-4 pr-2">
              {todaySchedule.map((session, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg"
                >
                  <div className="text-blue-400 font-medium min-w-[80px]">
                    {session.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{session.student}</p>
                    <p className="text-gray-400 text-sm">
                      {session.subject} with {session.tutor}
                    </p>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <MapPin size={14} className="mr-1" />
                    {session.location}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const handleStudentSubmit = async (formData: any) => {
    console.log('formDataformDataformData', formData);
    const supabase = await createClient();
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([formData]);

      console.log('datadatadata', data);
      setActiveTab('students');
      if (error) {
        console.error('Insert error:', error);
        alert('Failed to register student: ' + error.message);
        return;
      }
      alert('Student registered successfully!');
      setShowForm(false); // hide form after successful insert
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Unexpected error occurred');
    }
  };

  const renderAddStudents = () => (
    <div className="space-y-6">
      <StudentRegister
        onSubmit={handleStudentSubmit}
        onClose={
          () =>
            // console.log('object',showForm)
            setShowForm(false)

          // console.log('object',showForm)

          //   setActiveTab('students');
        }
      />
    </div>
  );
  const renderStudents = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-white">Students Management</h2>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          onClick={() => setShowForm(true)}
        >
          <Plus size={20} />
          <span>Add Student</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
          <Filter size={20} />
          <span>Filter</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="max-h-96 overflow-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <table className="w-full">
            <thead className="bg-gray-700 sticky top-0 z-10">
              <tr>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  Student
                </th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  Phone_No
                </th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  Date_of_Birth
                </th>

                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  Address
                </th>
                <th className="text-left py-4 px-6 text-gray-300 font-medium">
                  City
                </th>
                <th className="text-right py-4 px-6 text-gray-300 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {studentsData.map((student, index) => (
                <tr
                  key={student.id}
                  className={`${
                    index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'
                  } hover:bg-gray-700 transition-colors`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {`${student.first_name.charAt(
                            0
                          )}${student.last_name.charAt(0)}`}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {student.first_name}
                        </p>
                        <p className="text-gray-400 text-sm">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-300">{student.phone}</td>
                  <td className="py-4 px-6 text-gray-300">
                    {student.date_of_birth}
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-green-600 text-white px-2 py-1 rounded-full text-sm font-medium">
                      {student.address}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-300">{student.city}</td>
                  {/* <td className="py-4 px-6 text-right">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </td> */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        className="flex items-center gap-1 py-1 text-sm hover:text-gray-100 text-white"
                        onClick={() => console.log('View clicked')}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="flex items-center gap-1 py-1 text-sm hover:text-red-400 text-red-600"
                        onClick={() => handleDelete(student.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTutors = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-white">Tutors Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus size={20} />
          <span>Add Tutor</span>
        </button>
      </div>

      {/* Tutors Grid - Scrollable */}
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {tutor.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <MoreVertical size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {/* <div>
                  <h3 className="text-white font-semibold text-lg">
                    {tutor.name}
                  </h3>
                  <p className="text-blue-400 font-medium">{tutor.subject}</p>
                </div> */}

                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>{tutor.students} students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star size={16} className="text-yellow-400" />
                    <span>{tutor.rating}</span>
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Award size={16} />
                    <span>{tutor.experience} experience</span>
                  </span>
                </div>

                <div className="flex space-x-2 mt-4">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                    View Profile
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
                    <Mail size={16} />
                  </button>
                  <button className="flex items-center justify-center w-10 h-10 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
                    <Phone size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h2 className="text-2xl font-bold text-white">Schedule Management</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus size={20} />
          <span>Schedule Class</span>
        </button>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">
          Today's Schedule
        </h3>
        {/* Scrollable schedule container */}
        <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
          <div className="space-y-4">
            {todaySchedule.map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-600 rounded-lg p-3">
                    <Clock size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{session.time}</p>
                    <p className="text-gray-400 text-sm">{session.subject}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">{session.student}</p>
                  <p className="text-gray-400 text-sm">with {session.tutor}</p>
                </div>
                <div className="flex items-center text-gray-400">
                  <MapPin size={16} className="mr-1" />
                  <span>{session.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h2 className="text-white font-medium">thurs's Org</h2>
              <p className="text-gray-400 text-xs">Free</p>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center space-x-2 text-sm">
              <Database size={16} className="text-gray-400" />
              <span className="text-gray-300">homeacademy_supbase</span>
            </div>
            <button className="mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1">
              <span>Connect</span>
            </button>
          </div>
        </div>

        {/* Sidebar Navigation - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <div className="p-4 space-y-1">
            {sidebarItems.map((item) => (
              <SidebarItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Academy Dashboard
              </h1>
              <p className="text-gray-400">Home Tuitions Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                {/* <input
                  type="text"
                  placeholder="Quick search..."
                  className="w-64 pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                /> */}
                <input
                  type="text"
                  placeholder="Quick search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-64 pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="text-white font-medium">A</span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 p-3 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">A</span>
                        </div>
                        <div className="w-40">
                          {' '}
                          {/* or w-full, max-w-xs, etc. */}
                          <p className="text-white font-medium ">Admin User</p>
                          <p className="text-gray-400 text-sm break-words">
                            thursikamokananathan@gmail.com
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <Settings size={18} />
                        <span>Account Preferences</span>
                      </button>

                      <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <FolderOpen size={18} />
                        <span>All Projects</span>
                      </button>

                      <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <Globe size={18} />
                        <span>Supabase.com</span>
                      </button>

                      <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <Github size={18} />
                        <span>GitHub</span>
                      </button>

                      <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                        <HelpCircle size={18} />
                        <span>Support</span>
                      </button>
                    </div>

                    {/* Theme Section */}
                    <div className="border-t border-gray-700 py-2">
                      <div className="px-4 py-2">
                        <p className="text-gray-400 text-sm font-medium">
                          Theme
                        </p>
                      </div>

                      <div className="px-4 space-y-1">
                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                            defaultChecked
                          />
                          <span className="text-gray-300 text-sm">System</span>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-300 text-sm">Dark</span>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-300 text-sm">Light</span>
                        </label>
                      </div>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-700 py-2">
                      <Link
                        href="/auth/login"
                        className="underline underline-offset-4"
                      >
                        <button className="w-full flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors">
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex space-x-1">
            <TabButton id="overview" label="Overview" icon={Target} />
            <TabButton id="students" label="Students" icon={Users} />
            <TabButton id="tutors" label="Tutors" icon={GraduationCap} />
            <TabButton id="schedule" label="Schedule" icon={Calendar} />
            <TabButton id="subjects" label="Subjects" icon={BookOpen} />
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'students' &&
            (showForm ? renderAddStudents() : renderStudents())}

          {activeTab === 'tutors' && renderTutors()}
          {activeTab === 'schedule' && renderSchedule()}
          {activeTab === 'subjects' && (
            <div className="text-center py-12">
              <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                Subjects Management
              </h3>
              <p className="text-gray-500">
                Subject management features coming soon...
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
