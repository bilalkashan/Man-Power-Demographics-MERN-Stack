import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  ShieldCheck,
  Heart,
  CheckCircle,
  ArrowRight,
  Globe,
  Lock,
  Search,
  Award,
  ClipboardCheck,
  GitBranch,
  Map,
  PieChart,
  Compass,
  HelpingHand,
  PenTool,
  Scissors,
  Layers,
  Shuffle,
  Activity,
  Scale,
  BookOpen,
  Settings,
  GraduationCap,
  BarChart2,
  Smile,
  UserCheck,
  Target,
  DollarSign,
  Brain,
  MessageCircle,
  Cpu,
  MonitorPlay,
  Zap,
  RefreshCw,    // New: RPO
  Database,     // New: Pipeline
  CreditCard,   // New: Payroll
  Server,       // New: Tech
  Laptop,       // New: Software
  BarChart      // New: Analytics
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CompensationPic from "../assets/images/compensation.png";
import EquitablePic from "../assets/images/equitable.png";
import VariablePic from "../assets/images/variable.png";
import TotalRewardsPic from "../assets/images/totalRewards.png";

const Services = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* 1. Header Hero Section */}
      <div className="bg-primary py-20 text-center text-white">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="max-w-4xl mx-auto px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Core Competencies
          </h1>
          <p className="text-lg text-gray-300">
            Comprehensive Human Resource solutions designed to streamline
            operations and enhance employee satisfaction.
          </p>
        </motion.div>
      </div>

      {/* 2. Executive Search (Gray Background) */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <span className="text-accent font-bold tracking-widest uppercase text-sm">
              Premium Service
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-6">
              Executive Search & Recruitment
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At <span className="font-bold text-primary">MY HR</span>, we
              understand that exceptional leadership drives organizational
              success.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <DetailedCard
              icon={<Award className="w-8 h-8" />}
              title="C-Suite & Leadership Placements"
              points={[
                {
                  bold: "Targeted Talent Search:",
                  text: "Connecting you with transformative leaders who bring vision and innovation.",
                },
                {
                  bold: "Global Reach:",
                  text: "Extensive network spanning industries and geographies.",
                },
                {
                  bold: "Cultural Alignment:",
                  text: "Ensuring candidates align with your organization’s values.",
                },
              ]}
            />
            <DetailedCard
              icon={<Users className="w-8 h-8" />}
              title="Diversity-Focused Recruitment"
              points={[
                {
                  bold: "Promoting Inclusive Leadership:",
                  text: "Sourcing talent from underrepresented groups to ensure diverse representation.",
                },
                {
                  bold: "Unconscious Bias Mitigation:",
                  text: "Leveraging structured evaluation processes to maintain equity and objectivity.",
                },
              ]}
            />
            <DetailedCard
              icon={<Search className="w-8 h-8" />}
              title="Specialized & Niche Roles"
              points={[
                {
                  bold: "Industry-Specific Expertise:",
                  text: "Filling high-stakes roles in finance, technology, retail, and more.",
                },
                {
                  bold: "Deep Market Insights:",
                  text: "Data-driven insights to identify candidates who meet emerging needs.",
                },
              ]}
            />
            <DetailedCard
              icon={<Lock className="w-8 h-8" />}
              title="Confidential & High-Stakes Searches"
              points={[
                {
                  bold: "Discretion Guaranteed:",
                  text: "For roles like CEO, CFO, or sensitive positions, our approach ensures complete confidentiality.",
                },
                {
                  bold: "Trusted Process:",
                  text: "A secure and private vetting process for high-profile placements.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 3. Talent & Workforce Management (White Background) */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <span className="text-green-600 font-bold tracking-widest uppercase text-sm">
              Strategic Development
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-6">
              Talent & Workforce Management
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Future-proof your workforce with MY HR’s talent solutions that
              ensure you{" "}
              <span className="font-semibold text-primary">
                attract, retain, and develop
              </span>{" "}
              the best people.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <DetailedCard
              icon={<ClipboardCheck className="w-8 h-8" />}
              title="Competency Frameworks"
              points={[
                {
                  bold: "Skill Assessment:",
                  text: "Designing models to strictly assess current employee skills.",
                },
                {
                  bold: "Gap Identification:",
                  text: "Identifying critical skill gaps hindering business growth.",
                },
                {
                  bold: "Development Guide:",
                  text: "Creating clear pathways for professional development.",
                },
              ]}
            />
            <DetailedCard
              icon={<GitBranch className="w-8 h-8" />}
              title="Succession Planning"
              points={[
                {
                  bold: "Future Leaders:",
                  text: "Building a pipeline of future leaders ready to step up.",
                },
                {
                  bold: "Risk Mitigation:",
                  text: "Ensuring continuity in critical roles to prevent operational disruption.",
                },
                {
                  bold: "Leadership Readiness:",
                  text: "Preparing high-potential employees for key responsibilities.",
                },
              ]}
            />
            <DetailedCard
              icon={<Map className="w-8 h-8" />}
              title="Talent Mapping & Gap Analysis"
              points={[
                {
                  bold: "Detailed Reviews:",
                  text: "Conducting comprehensive reviews of organizational capability.",
                },
                {
                  bold: "Market Benchmarking:",
                  text: "Comparing internal talent against external market standards.",
                },
                {
                  bold: "Strategic Filling:",
                  text: "Identifying and filling workforce capability gaps effectively.",
                },
              ]}
            />
            <DetailedCard
              icon={<PieChart className="w-8 h-8" />}
              title="Strategic Workforce Planning"
              points={[
                {
                  bold: "Resource Alignment:",
                  text: "Aligning human resources with long-term strategic objectives.",
                },
                {
                  bold: "Forecasting:",
                  text: "Predicting future hiring needs based on business growth.",
                },
                {
                  bold: "Optimization:",
                  text: "Ensuring the right people are in the right roles at the right time.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 4. Career Management & Outplacement (Gray Background) */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <span className="text-purple-600 font-bold tracking-widest uppercase text-sm">
              Transition & Growth
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-6">
              Career Management & Outplacement
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Supporting professionals and organizations through career
              transitions with compassion and expertise.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <DetailedCard
              icon={<Compass className="w-8 h-8" />}
              title="Personalized Career Coaching"
              points={[
                {
                  bold: "Guidance:",
                  text: "Helping individuals navigate complex career challenges.",
                },
                {
                  bold: "Exploration:",
                  text: "Identifying and exploring new professional opportunities.",
                },
                {
                  bold: "Development:",
                  text: "Building actionable plans for career advancement.",
                },
              ]}
            />
            <DetailedCard
              icon={<HelpingHand className="w-8 h-8" />}
              title="Outplacement Services"
              points={[
                {
                  bold: "Support:",
                  text: "Offering impacted employees comprehensive and compassionate support.",
                },
                {
                  bold: "Preparation:",
                  text: "Resume writing, interview preparation, and job search guidance.",
                },
                {
                  bold: "Transition:",
                  text: "Ensuring a smooth transition for employees leaving the organization.",
                },
              ]}
            />
            <DetailedCard
              icon={<PenTool className="w-8 h-8" />}
              title="Professional Branding"
              points={[
                {
                  bold: "Visibility:",
                  text: "Crafting resumes, LinkedIn profiles, and cover letters.",
                },
                {
                  bold: "Marketability:",
                  text: "Enhancing personal market visibility and appeal.",
                },
                {
                  bold: "Messaging:",
                  text: "Defining a clear and compelling professional narrative.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 5. Headcount Rationalization (White Background) */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <span className="text-red-600 font-bold tracking-widest uppercase text-sm">
              Strategic Sizing
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-6">
              Headcount Rationalization
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Strategically managing workforce size and structure to align with
              organizational priorities and optimize resources.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <DetailedCard
              icon={<Scissors className="w-8 h-8" />}
              title="Rationalization & Efficiency"
              points={[
                {
                  bold: "Role Evaluation:",
                  text: "Evaluating roles and reducing redundancies.",
                },
                {
                  bold: "Cost Management:",
                  text: "Managing costs while maintaining operational efficiency.",
                },
                {
                  bold: "Optimization:",
                  text: "Streamlining team structures for better output.",
                },
              ]}
            />
            <DetailedCard
              icon={<Layers className="w-8 h-8" />}
              title="Workforce Restructuring"
              points={[
                {
                  bold: "Capacity Alignment:",
                  text: "Aligning workforce capacity with business goals.",
                },
                {
                  bold: "Strategic Adaptation:",
                  text: "Managing plans during expansions, mergers, or downturns.",
                },
                {
                  bold: "Structural Design:",
                  text: "Reorganizing reporting lines for agility.",
                },
              ]}
            />
            <DetailedCard
              icon={<Activity className="w-8 h-8" />}
              title="Scenario Planning"
              points={[
                {
                  bold: "Impact Assessment:",
                  text: "Conducting assessments to ensure informed decision-making.",
                },
                {
                  bold: "Future Proofing:",
                  text: "Modeling different business scenarios to prepare the workforce.",
                },
                {
                  bold: "Risk Analysis:",
                  text: "Identifying potential risks in headcount changes.",
                },
              ]}
            />
            <DetailedCard
              icon={<Shuffle className="w-8 h-8" />}
              title="Change Management Support"
              points={[
                {
                  bold: "Implementation:",
                  text: "Helping organizations implement headcount changes effectively.",
                },
                {
                  bold: "Culture Preservation:",
                  text: "Minimizing disruption and maintaining morale.",
                },
                {
                  bold: "Communication:",
                  text: "Clear strategies for communicating changes to staff.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 6. Compliance & Policy Advisory (Gray Background) */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">
              Risk Mitigation
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-6">
              Compliance & Policy Advisory
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Navigating HR compliance is critical for risk mitigation and
              operational success. We ensure you are always audit-ready.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <DetailedCard
              icon={<BookOpen className="w-8 h-8" />}
              title="Policy Development"
              points={[
                {
                  bold: "Crafting Policies:",
                  text: "Creating DE&I-focused and business-aligned HR policies.",
                },
                {
                  bold: "Employee Handbooks:",
                  text: "Writing clear guidelines for employee conduct and benefits.",
                },
                {
                  bold: "Alignment:",
                  text: "Ensuring policies match company culture and goals.",
                },
              ]}
            />
            <DetailedCard
              icon={<Scale className="w-8 h-8" />}
              title="Compliance Audits"
              points={[
                {
                  bold: "Gap Analysis:",
                  text: "Identifying and addressing gaps in employment laws.",
                },
                {
                  bold: "Risk Assessment:",
                  text: "Evaluating internal practices against legal standards.",
                },
                {
                  bold: "Reporting:",
                  text: "Detailed audit reports with actionable solutions.",
                },
              ]}
            />
            <DetailedCard
              icon={<Settings className="w-8 h-8" />}
              title="Process Standardization"
              points={[
                {
                  bold: "Streamlining:",
                  text: "Optimizing HR processes to ensure consistency.",
                },
                {
                  bold: "Efficiency:",
                  text: "Reducing administrative burden through better workflows.",
                },
                {
                  bold: "SOP Creation:",
                  text: "Documenting standard operating procedures for HR teams.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 7. Diversity, Equity & Inclusion (White Background) */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <span className="text-teal-600 font-bold tracking-widest uppercase text-sm">
              Culture & Belonging
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-6">
              Diversity, Equity & Inclusion
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At <span className="font-bold text-primary">MY HR</span>, we
              understand that building a diverse, equitable, and inclusive
              workplace is a strategic business advantage.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            <SimpleCard
              icon={<Target />}
              title="DE&I Strategy"
              desc="Designing actionable, measurable roadmaps tailored to your culture."
            />
            <SimpleCard
              icon={<ClipboardCheck />}
              title="Diversity Audits"
              desc="Evaluations of workforce demographics and hiring practices."
            />
            <SimpleCard
              icon={<Users />}
              title="Inclusion Workshops"
              desc="Equipping leaders with skills to create inclusive workplaces."
            />
            <SimpleCard
              icon={<GraduationCap />}
              title="Diversity Training"
              desc="Programs to raise awareness and address implicit biases."
            />
            <SimpleCard
              icon={<FileText />}
              title="Policy Redesign"
              desc="Creating equitable frameworks for pay and promotions."
            />
            <SimpleCard
              icon={<Smile />}
              title="Employee Groups (ERGs)"
              desc="Supporting affinity groups to foster belonging."
            />
            <SimpleCard
              icon={<UserCheck />}
              title="Leadership Coaching"
              desc="Training leaders to champion inclusion cultural change."
            />
            <SimpleCard
              icon={<BarChart2 />}
              title="Metrics & Reporting"
              desc="Establishing KPIs to monitor and refine DE&I efforts."
            />
          </div>
        </div>
      </section>

      {/* 8. Reward and Compensation Design (Gray Background) */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <span className="text-amber-600 font-bold tracking-widest uppercase text-sm flex items-center justify-center">
              Value & Recognition
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-6">
              Reward & Compensation Design
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              MY HR designs competitive and equitable reward systems that align
              with market standards and organizational goals to attract and
              retain top talent.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            <ImageServiceCard
              image={CompensationPic}
              title="Compensation Benchmarking"
              desc="Evaluating and aligning salary structures with industry standards and best practices."
            />
            <ImageServiceCard
              image={VariablePic}
              title="Variable Pay Programs"
              desc="Developing incentive and commission schemes to drive performance and motivation."
            />
            <ImageServiceCard
              image={EquitablePic}
              title="Equitable Pay Structures"
              desc="Creating frameworks that promote fairness and transparency in compensation across the board."
            />
            <ImageServiceCard
              image={TotalRewardsPic}
              title="Total Rewards Strategy"
              desc="Combining monetary and non-monetary benefits to create a compelling employee value proposition."
            />
          </div>
        </div>
      </section>

      {/* 9. Learning & Development (White Background) */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <span className="text-indigo-600 font-bold tracking-widest uppercase text-sm flex items-center justify-center">
              Upskilling for Competitiveness
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-6">
              Learning & Development (L&D)
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Upskilling employees and leaders is essential for staying
              competitive. <span className="font-bold text-primary">MY HR’s</span>{" "}
              L&D services deliver impactful training tailored to your
              organization’s needs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <DetailedCard
              icon={<Brain className="w-8 h-8" />}
              title="Leadership Development"
              points={[
                {
                  bold: "Strategic Thinking:",
                  text: "Programs to enhance strategic vision and decision-making.",
                },
                {
                  bold: "Management:",
                  text: "Advanced techniques for effective team management.",
                },
              ]}
            />
            <DetailedCard
              icon={<Globe className="w-8 h-8" />}
              title="Inclusive Leadership"
              points={[
                {
                  bold: "Equitable Environments:",
                  text: "Equipping leaders to create safe and fair spaces.",
                },
                {
                  bold: "Championing Diversity:",
                  text: "Tools to actively promote diversity within teams.",
                },
              ]}
            />
            <DetailedCard
              icon={<MessageCircle className="w-8 h-8" />}
              title="Soft Skills Development"
              points={[
                {
                  bold: "Communication:",
                  text: "Workshops to enhance verbal and non-verbal communication.",
                },
                {
                  bold: "Emotional Intelligence:",
                  text: "Building teamwork and empathy across the organization.",
                },
              ]}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <DetailedCard
              icon={<Cpu className="w-8 h-8" />}
              title="Technical Competence"
              points={[
                {
                  bold: "Job-Specific Skills:",
                  text: "Focused training on industry-specific tools and methodologies.",
                },
                {
                  bold: "Functional Mastery:",
                  text: "Deepening expertise in core job functions.",
                },
              ]}
            />
            <DetailedCard
              icon={<MonitorPlay className="w-8 h-8" />}
              title="E-Learning Solutions"
              points={[
                {
                  bold: "Tailored Pathways:",
                  text: "Crafting digital learning paths aligned with growth goals.",
                },
                {
                  bold: "Flexibility:",
                  text: "On-demand learning modules for a remote or hybrid workforce.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 10. Recruitment Process Outsourcing (Gray Background - NEW SECTION) */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <span className="text-orange-600 font-bold tracking-widest uppercase text-sm flex items-center justify-center">
              Efficiency & Scale
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-6">
              Recruitment Process Outsourcing (RPO)
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Efficiently managing the recruitment lifecycle to help
              organizations save time, reduce costs, and hire quality talent.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <DetailedCard
              icon={<RefreshCw className="w-8 h-8" />}
              title="End-to-End Recruitment"
              points={[
                {
                  bold: "Lifecycle Management:",
                  text: "Handling everything from sourcing and screening to onboarding.",
                },
                {
                  bold: "Efficiency:",
                  text: "Streamlining the hiring process to reduce time-to-fill.",
                },
              ]}
            />
            <DetailedCard
              icon={<Users className="w-8 h-8" />}
              title="Temporary & Bulk Staffing"
              points={[
                {
                  bold: "Project Staffing:",
                  text: "Delivering skilled candidates for short-term projects.",
                },
                {
                  bold: "High-Volume Hiring:",
                  text: "Meeting scalable demands for mass recruitment drives.",
                },
              ]}
            />
            <DetailedCard
              icon={<Database className="w-8 h-8" />}
              title="Talent Pipeline Development"
              points={[
                {
                  bold: "Future Readiness:",
                  text: "Building pools of pre-qualified candidates.",
                },
                {
                  bold: "Proactive Sourcing:",
                  text: "Preparing for future hiring demands before they arise.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 11. Payroll Outsourcing & Technology (White Background - NEW SECTION) */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <span className="text-cyan-600 font-bold tracking-widest uppercase text-sm flex items-center justify-center">
              Digital Operations
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary mt-2 mb-6">
              Payroll Outsourcing & Technology
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Streamline HR operations with advanced technology solutions,
              ensuring compliance and data-driven decision making.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <DetailedCard
              icon={<CreditCard className="w-8 h-8" />}
              title="Integrated Payroll Systems"
              points={[
                {
                  bold: "Accuracy:",
                  text: "Ensuring accurate and timely payroll processing.",
                },
                {
                  bold: "Compliance:",
                  text: "Managing tax deductions and statutory regulations efficiently.",
                },
              ]}
            />
            <DetailedCard
              icon={<BarChart className="w-8 h-8" />}
              title="HR Analytics & Dashboards"
              points={[
                {
                  bold: "Insights:",
                  text: "Providing actionable data to improve HR decision-making.",
                },
                {
                  bold: "Reporting:",
                  text: "Visual dashboards for realtime workforce metrics.",
                },
              ]}
            />
            <DetailedCard
              icon={<Laptop className="w-8 h-8" />}
              title="HR Software Implementation"
              points={[
                {
                  bold: "Deployment:",
                  text: "Supporting the rollout of modern HR tools.",
                },
                {
                  bold: "Optimization:",
                  text: "Ensuring systems are configured for maximum operational efficiency.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* 12. CTA Section */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Workforce?
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            From executive searches to comprehensive L&D programs, we have the
            expertise to drive your success.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-full font-bold hover:bg-blue-600 transition shadow-lg"
          >
            Contact HR Consultant <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// --- Sub Components ---

// 1. Detailed Card (Used for most sections)
const DetailedCard = ({ icon, title, points }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-xl shadow-md border border-gray-200 h-full hover:shadow-xl transition-all duration-300 hover:border-accent/50 group"
  >
    <div className="flex items-center mb-6">
      <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center mr-4 group-hover:bg-accent transition-colors flex-shrink-0">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary transition-colors">
        {title}
      </h3>
    </div>

    <ul className="space-y-4">
      {points.map((point, i) => (
        <li
          key={i}
          className="flex items-start text-gray-600 text-sm leading-relaxed"
        >
          <CheckCircle className="w-5 h-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
          <span>
            <strong className="text-gray-900 block mb-1">{point.bold}</strong>
            {point.text}
          </span>
        </li>
      ))}
    </ul>
  </motion.div>
);

// 2. Simple Card (Used for DE&I Section)
const SimpleCard = ({ icon, title, desc }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md hover:border-teal-500 transition-all duration-300"
  >
    <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h4 className="font-bold text-gray-800 mb-2">{title}</h4>
    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
  </motion.div>
);

// 3. Image Service Card (New component for Rewards section)
const ImageServiceCard = ({ image, title, desc }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 h-full hover:shadow-xl transition-all duration-300 group"
  >
    <div className="h-48 overflow-hidden relative">
      {/* Subtle overlay for better text contrast if needed */}
      <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/0 transition-colors z-10"></div>
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
      />
    </div>
    <div className="p-6 relative z-20 bg-white">
      <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors">
        {title}
      </h3>
      {/* Amber accent line */}
      <div className="w-12 h-1 bg-amber-500 mb-4 rounded-full"></div>
      <p className="text-gray-600 leading-relaxed text-sm">{desc}</p>
    </div>
  </motion.div>
);

export default Services;