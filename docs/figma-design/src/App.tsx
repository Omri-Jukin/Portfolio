import { useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Separator } from './components/ui/separator';
import { 
  Briefcase, 
  Code, 
  GraduationCap, 
  Mail, 
  MapPin, 
  Calendar,
  ExternalLink,
  Github,
  Linkedin,
  FileText,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('employers');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
              <span className="text-white font-bold">OJ</span>
            </div>
            <div>
              <h1 className="font-semibold text-slate-900">Omri Jukin</h1>
              <p className="text-sm text-slate-600">Full Stack Developer</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('employers')}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              For Employers
            </button>
            <button 
              onClick={() => setActiveTab('clients')}
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              For Clients
            </button>
            <a href="#contact" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
              Contact
            </a>
          </nav>
          <Button>Let's Talk</Button>
        </div>
      </header>

      <main className="container mx-auto px-4">
        {/* Hero Section - Compact */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4" variant="secondary">
              <MapPin className="w-3 h-3 mr-1" />
              Available for Full-Time & Freelance
            </Badge>
            <h1 className="text-slate-900 mb-4">
              Full Stack Developer Building Scalable Web Applications
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto mb-8">
              Specialized in React, Node.js, and cloud infrastructure. I help companies ship robust products 
              and provide technical consulting for businesses looking to scale.
            </p>
            
            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                onClick={() => setActiveTab('employers')}
                className="gap-2"
              >
                <Briefcase className="w-4 h-4" />
                I'm Hiring
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setActiveTab('clients')}
                className="gap-2"
              >
                <Code className="w-4 h-4" />
                I Need Development
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">5+</div>
                <div className="text-sm text-slate-600">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">50+</div>
                <div className="text-sm text-slate-600">Projects Delivered</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">20+</div>
                <div className="text-sm text-slate-600">Technologies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900 mb-1">98%</div>
                <div className="text-sm text-slate-600">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Tabs */}
        <section className="py-8 md:py-12">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="employers" className="gap-2">
                <Briefcase className="w-4 h-4" />
                For Employers
              </TabsTrigger>
              <TabsTrigger value="clients" className="gap-2">
                <Users className="w-4 h-4" />
                For Clients
              </TabsTrigger>
            </TabsList>

            {/* Employers Tab */}
            <TabsContent value="employers" className="space-y-8">
              {/* Professional Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Professional Summary</CardTitle>
                  <CardDescription>
                    Full-stack developer with expertise in modern web technologies and cloud infrastructure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600">
                    I specialize in building scalable web applications using React, TypeScript, Node.js, and cloud platforms. 
                    With 5+ years of experience, I've led development teams, architected complex systems, and delivered 
                    high-impact products for startups and enterprises.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge>React</Badge>
                    <Badge>TypeScript</Badge>
                    <Badge>Node.js</Badge>
                    <Badge>Next.js</Badge>
                    <Badge>PostgreSQL</Badge>
                    <Badge>AWS</Badge>
                    <Badge>Docker</Badge>
                    <Badge>CI/CD</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Experience Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Experience Item 1 */}
                  <div className="border-l-2 border-blue-600 pl-4 pb-6 relative">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-600" />
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">Senior Full Stack Developer</h3>
                        <p className="text-slate-600">Tech Company Inc.</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Calendar className="w-3 h-3" />
                        2021 - Present
                      </div>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                      <li>Led development of microservices architecture serving 100K+ users</li>
                      <li>Reduced page load time by 60% through optimization strategies</li>
                      <li>Mentored junior developers and conducted code reviews</li>
                    </ul>
                  </div>

                  {/* Experience Item 2 */}
                  <div className="border-l-2 border-slate-300 pl-4 relative">
                    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-slate-300" />
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-slate-900">Full Stack Developer</h3>
                        <p className="text-slate-600">Startup Solutions Ltd.</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <Calendar className="w-3 h-3" />
                        2019 - 2021
                      </div>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                      <li>Built responsive web applications using React and Node.js</li>
                      <li>Implemented CI/CD pipelines reducing deployment time by 50%</li>
                      <li>Collaborated with design team to improve user experience</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Key Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Key Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">Performance Optimization</p>
                        <p className="text-sm text-slate-600">Improved application performance by 60%, reducing load times from 5s to 2s</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">Team Leadership</p>
                        <p className="text-sm text-slate-600">Led a team of 5 developers, improving sprint velocity by 40%</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-slate-900">Quality & Testing</p>
                        <p className="text-sm text-slate-600">Implemented comprehensive testing strategy, reducing production bugs by 75%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Education & Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education & Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">B.Sc. Computer Science</h3>
                    <p className="text-sm text-slate-600">University Name • 2015-2019</p>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="font-medium text-slate-900">Certifications:</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">AWS Certified Solutions Architect</Badge>
                      <Badge variant="outline">Google Cloud Professional</Badge>
                      <Badge variant="outline">Kubernetes Administrator</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-0">
                <CardContent className="py-8 text-center">
                  <h3 className="text-2xl font-bold mb-3">Ready to Hire?</h3>
                  <p className="mb-6 text-blue-50">
                    Download my resume or get in touch to discuss opportunities
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button size="lg" variant="secondary" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Download Resume
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <Mail className="w-4 h-4" />
                      Contact Me
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Clients Tab */}
            <TabsContent value="clients" className="space-y-8">
              {/* Services Overview */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <Code className="w-10 h-10 mb-2 text-blue-600" />
                    <CardTitle>Full Stack Development</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">
                      End-to-end web application development using modern frameworks and best practices.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <TrendingUp className="w-10 h-10 mb-2 text-green-600" />
                    <CardTitle>Performance Optimization</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">
                      Speed up your application with expert optimization techniques and architecture review.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Users className="w-10 h-10 mb-2 text-purple-600" />
                    <CardTitle>Technical Consulting</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">
                      Strategic technical guidance, architecture planning, and team mentoring services.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Pricing Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Pricing & Packages
                  </CardTitle>
                  <CardDescription>
                    Transparent pricing for different engagement models
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Hourly */}
                    <div className="border rounded-lg p-6 space-y-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Hourly Consulting</h3>
                        <div className="text-3xl font-bold text-slate-900">$100<span className="text-lg font-normal text-slate-600">/hr</span></div>
                      </div>
                      <Separator />
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Technical consulting
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Code review
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Architecture guidance
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Flexible scheduling
                        </li>
                      </ul>
                      <Button className="w-full" variant="outline">Get Started</Button>
                    </div>

                    {/* Project Based */}
                    <div className="border-2 border-blue-600 rounded-lg p-6 space-y-4 relative">
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Project Based</h3>
                        <div className="text-3xl font-bold text-slate-900">$5K+<span className="text-lg font-normal text-slate-600">/project</span></div>
                      </div>
                      <Separator />
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Full project delivery
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Defined scope & timeline
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Regular updates
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Post-launch support
                        </li>
                      </ul>
                      <Button className="w-full">Get Started</Button>
                    </div>

                    {/* Retainer */}
                    <div className="border rounded-lg p-6 space-y-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Monthly Retainer</h3>
                        <div className="text-3xl font-bold text-slate-900">$8K+<span className="text-lg font-normal text-slate-600">/mo</span></div>
                      </div>
                      <Separator />
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Dedicated availability
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Priority support
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Ongoing development
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          Strategic planning
                        </li>
                      </ul>
                      <Button className="w-full" variant="outline">Get Started</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Process */}
              <Card>
                <CardHeader>
                  <CardTitle>How I Work</CardTitle>
                  <CardDescription>My proven process for successful project delivery</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 font-bold">
                        1
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">Discovery</h4>
                      <p className="text-sm text-slate-600">Understanding your needs and project goals</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 font-bold">
                        2
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">Planning</h4>
                      <p className="text-sm text-slate-600">Creating detailed specifications and timeline</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 font-bold">
                        3
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">Development</h4>
                      <p className="text-sm text-slate-600">Building with regular updates and feedback</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 font-bold">
                        4
                      </div>
                      <h4 className="font-semibold text-slate-900 mb-2">Launch</h4>
                      <p className="text-sm text-slate-600">Deployment and ongoing support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0">
                <CardContent className="py-8 text-center">
                  <h3 className="text-2xl font-bold mb-3">Ready to Start Your Project?</h3>
                  <p className="mb-6 text-purple-50">
                    Let's discuss your needs and find the right solution for your business
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button size="lg" variant="secondary" className="gap-2">
                      <Mail className="w-4 h-4" />
                      Request Quote
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                      Schedule Consultation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Featured Projects */}
        <section className="py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-slate-900 mb-2">Featured Projects</h2>
              <p className="text-slate-600">Recent work showcasing impact and technical expertise</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Project 1 */}
              <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-500 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Code className="w-16 h-16 text-white/30" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>E-Commerce Platform</CardTitle>
                  <CardDescription>Full-stack marketplace application</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Built a scalable e-commerce platform handling 10K+ daily transactions with real-time inventory management.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">Node.js</Badge>
                    <Badge variant="secondary">PostgreSQL</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-600 font-semibold">↑ 150% Revenue</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-600">2023</span>
                  </div>
                </CardContent>
              </Card>

              {/* Project 2 */}
              <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp className="w-16 h-16 text-white/30" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>Analytics Dashboard</CardTitle>
                  <CardDescription>Real-time data visualization</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Developed interactive dashboard processing 1M+ data points with advanced filtering and export capabilities.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">D3.js</Badge>
                    <Badge variant="secondary">Python</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-600 font-semibold">↓ 40% Time Saved</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-600">2024</span>
                  </div>
                </CardContent>
              </Card>

              {/* Project 3 */}
              <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-orange-500 to-red-500 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-16 h-16 text-white/30" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>Team Collaboration Tool</CardTitle>
                  <CardDescription>Project management platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Created collaborative workspace with real-time updates, file sharing, and integrated communication.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">Next.js</Badge>
                    <Badge variant="secondary">WebSocket</Badge>
                    <Badge variant="secondary">AWS</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-600 font-semibold">500+ Teams</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-600">2024</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-8 md:py-12 pb-16">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Get In Touch</CardTitle>
                <CardDescription>
                  Whether you're looking to hire or need development services, I'd love to hear from you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Contact Form */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-900 mb-1 block">Name</label>
                      <Input placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-900 mb-1 block">Email</label>
                      <Input type="email" placeholder="your.email@example.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-900 mb-1 block">I'm interested in</label>
                      <select className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm">
                        <option>Full-time position</option>
                        <option>Freelance project</option>
                        <option>Consulting</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-900 mb-1 block">Message</label>
                      <Textarea placeholder="Tell me about your needs..." rows={4} />
                    </div>
                    <Button className="w-full" size="lg">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-slate-600">
                          <Mail className="w-5 h-5 flex-shrink-0" />
                          <a href="mailto:omri@example.com" className="hover:text-blue-600 transition-colors">
                            omri@example.com
                          </a>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600">
                          <MapPin className="w-5 h-5 flex-shrink-0" />
                          <span>Israel • Remote Available</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold text-slate-900 mb-4">Connect With Me</h3>
                      <div className="flex gap-3">
                        <Button variant="outline" size="icon" className="hover:bg-slate-100">
                          <Github className="w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="hover:bg-slate-100">
                          <Linkedin className="w-5 h-5" />
                        </Button>
                        <Button variant="outline" size="icon" className="hover:bg-slate-100">
                          <ExternalLink className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold text-slate-900 mb-4">Availability</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-slate-600">Available for full-time roles</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-slate-600">Accepting freelance projects</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                          <span className="text-slate-600">Limited consulting slots</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
              © 2024 Omri Jukin. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-600">
              <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
