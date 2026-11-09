import { useState } from 'react'
import FadeIn from '@/shared/ui/FadeIn'
import ProjectModal from './ProjectModal'

import thesisImg1 from '@/shared/assets/thesis_project/Automated Smart Waste Bin System.png'
import thesisImg2 from '@/shared/assets/thesis_project/dashboard.png'
import thesisImg3 from '@/shared/assets/thesis_project/Login Page.png'
import thesisImg4 from '@/shared/assets/thesis_project/student management.png'
import thesisImg5 from '@/shared/assets/thesis_project/Redeem points management.png'

import eduCheckTeacherPortal from '@/shared/assets/EduCheck/teacher portal.png'
import eduCheckLogin from '@/shared/assets/EduCheck/Loginform.png'
import eduCheckRegister from '@/shared/assets/EduCheck/register.png'
import eduCheckTeacherSubjects from '@/shared/assets/EduCheck/techer portal subject.png'
import eduCheckTeacherStudents from '@/shared/assets/EduCheck/teacher_students.png'
import eduCheckTeacherAttendance from '@/shared/assets/EduCheck/teacher_attendance.png'
import eduCheckTeacherGrades from '@/shared/assets/EduCheck/teacher_grades.png'
import eduCheckTeacherReport from '@/shared/assets/EduCheck/teacher_report.png'
import eduCheckStudentDashboard from '@/shared/assets/EduCheck/student_dashboard.png'
import eduCheckStudentAttendance from '@/shared/assets/EduCheck/student_attendance.png'
import eduCheckStudentGrades from '@/shared/assets/EduCheck/student_grades.png'
import eduCheckStudentProfile from '@/shared/assets/EduCheck/student_profile.png'

interface Project {
  title: string
  description: string
  longDescription: string
  image: null
  images: string[]
  tags: string[]
  liveUrl?: string
  githubUrl: string
  role: string
  duration: string
  features: string[]
}

const truncate = (str: string, len: number) =>
  str.length > len ? str.slice(0, len) + '…' : str

const projects: Project[] = [
  {
    title: 'Automated Smart Waste Bin System',
    description:
      'A smart waste bin that recognizes what is thrown into it,',
    longDescription:
      'A smart waste bin that recognizes what is thrown into it, identifies the person throwing it, sorts the waste automatically, and rewards the user with points they can redeem for campus perks.',
    image: null,
    images: [thesisImg1, thesisImg2, thesisImg3, thesisImg4, thesisImg5],
    tags: ['Python', 'Custom Software', 'Hardware Integration', 'IoT'],
    liveUrl: 'https://github.com/Jay154421',
    githubUrl: 'https://github.com/Jay154421',
    role: 'Full-Stack Developer',
    duration: 'Feb 2026 – May 2026, THESIS Project',
    features: [
      'Auto-classification of waste using a YOLO vision model (confidence threshold 0.5)',
      'QR-based user identification with the point-earning history attached to that user.',
      'Automatic sorting via servos that route each waste type to its compartment.',
      'Points and rewards system: earn points per disposal, redeem them for perks such as printing credits, hoodies, coffee vouchers, or exam kits (configurable in the admin panel)',
      'Full-bin SMS alerts through the IPROG SMS API when a compartment stays full.',
      'Auto-open lid controlled by an ultrasonic sensor when a user approaches.',
      'Real-time camera feed from an ESP32-CAM, with a live feed page and a setup page to connect hardware.',
      'Admin dashboard with disposal statistics, waste-type distribution, user management, and redemption tracking.'
    ],
  },
  {
    title: 'EduCheck',
    description:
      'Grading and attendance system for teachers and students.',
    longDescription:
      'EduCheck is a grading and attendance system for a school. Teachers manage subjects, enroll students, mark attendance, record grades per term, and export reports. Students log in to see their own attendance, grades, and profile. The React app talks directly to Supabase Auth, Postgres, and Storage, so there is no custom backend server.',
    image: null,
    images: [
      eduCheckTeacherPortal,
      eduCheckLogin,
      eduCheckRegister,
      eduCheckTeacherSubjects,
      eduCheckTeacherStudents,
      eduCheckTeacherAttendance,
      eduCheckTeacherGrades,
      eduCheckTeacherReport,
      eduCheckStudentDashboard,
      eduCheckStudentAttendance,
      eduCheckStudentGrades,
      eduCheckStudentProfile,
    ],
    tags: ['React', 'Vite', 'Supabase', 'Tailwind CSS'],
    githubUrl: 'https://github.com/Jay154421/Grading-and-Attendance-System',
    role: 'Full-Stack Developer',
    duration: '3rd Year BSCS, CSELEC3',
    features: [
      'Role-based login that opens a teacher portal or a student portal',
      'Teachers create subjects, enroll students, and create student logins',
      'Attendance marked per subject and date as present, absent, late, or excused',
      'Grades recorded per term with a cumulative average that skips missing terms',
      'Attendance and grade reports exported to CSV or PDF',
      'Students view their own attendance records, grades, and profile',
      'Profile photo upload stored in Supabase Storage',
      'Sidebar collapses to a rail on desktop and a drawer on mobile',
    ],
  },
]

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[number] | null>(null)

  return (
    <section
      id="projects"
      className="py-20 bg-[#FAF9F6]/70"
      aria-labelledby="projects-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2
            id="projects-heading"
            className="text-3xl sm:text-4xl font-heading font-bold text-gray-900 text-center mb-4"
          >
            Featured <span className="text-primary">Projects</span>
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="w-20 h-1 bg-primary mx-auto mb-12" />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <FadeIn key={project.title} delay={index * 150}>
              <article
                onClick={() => setSelectedProject(project)}
                className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:border-primary/30 transition-all shadow-sm hover:shadow-md group h-full cursor-pointer"
              >
                {/* Project Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center border-b border-gray-200">
                  {project.images.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <span className="text-4xl group-hover:scale-110 transition-transform">🖼️</span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {truncate(project.title, 22)}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                    {truncate(project.description, 58)}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-800 text-sm font-medium transition-colors"
                        aria-label={`View ${project.title} live demo`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Live Demo →
                      </a>
                    )}
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
                      aria-label={`View ${project.title} source code on GitHub`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      GitHub →
                    </a>
                  </div>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  )
}
