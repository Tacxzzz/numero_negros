import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import pdfFile from '../files/PisoPlay Manual - Tagalog.pdf';
import useBrowserCheck from '@/components/WebBrowserChecker';
import OpenInExternalBrowser from '@/components/OpenInExternalBrowser';
import { useUser } from './UserContext';
import { addLog } from '@/lib/apiCalls';

export function SupportPage() {
  const navigate = useNavigate();
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [category, setCategory] = useState('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('faq');
  const { setUserID,userID,deviceID } = useUser();
    
  useEffect(() => {
          if (userID) {
            const handleUpdate = async () => {
              const addViewLog = await addLog(userID, "visited Support");
              console.log(addViewLog.authenticated);
            };
            handleUpdate();
          }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
  
  // Mock data for support tickets
  const supportTickets = [
    {
      id: 'T-1234',
      subject: 'Withdrawal Issue',
      status: 'open',
      priority: 'high',
      date: '2023-05-15',
      time: '14:30',
      lastUpdate: '2 hours ago',
      messages: [
        {
          sender: 'user',
          name: 'John Doe',
          avatar: 'https://picsum.photos/id/1005/40/40',
          message: 'I requested a withdrawal 3 days ago but haven\'t received the funds yet. Can you please check the status?',
          timestamp: '2023-05-15 14:30'
        },
        {
          sender: 'support',
          name: 'Support Agent',
          avatar: 'https://picsum.photos/id/1010/40/40',
          message: 'Thank you for contacting support. I can see your withdrawal request in our system. It appears there was a delay due to verification requirements. I\'ve expedited the process, and you should receive your funds within 24 hours.',
          timestamp: '2023-05-15 15:45'
        }
      ]
    },
    {
      id: 'T-1235',
      subject: 'Account Verification',
      status: 'pending',
      priority: 'medium',
      date: '2023-05-14',
      time: '10:15',
      lastUpdate: '1 day ago',
      messages: [
        {
          sender: 'user',
          name: 'John Doe',
          avatar: 'https://picsum.photos/id/1005/40/40',
          message: 'I\'ve submitted my verification documents but my account is still showing as unverified. Can you help?',
          timestamp: '2023-05-14 10:15'
        },
        {
          sender: 'support',
          name: 'Support Agent',
          avatar: 'https://picsum.photos/id/1010/40/40',
          message: 'I\'ve checked your account and can see that your documents were received. Our verification team is currently reviewing them. This process typically takes 1-2 business days. I\'ve flagged your account for priority review.',
          timestamp: '2023-05-14 11:30'
        },
        {
          sender: 'user',
          name: 'John Doe',
          avatar: 'https://picsum.photos/id/1005/40/40',
          message: 'Thank you for the update. Please let me know once the verification is complete.',
          timestamp: '2023-05-14 12:45'
        }
      ]
    },
    {
      id: 'T-1236',
      subject: 'Bonus Not Applied',
      status: 'closed',
      priority: 'low',
      date: '2023-05-10',
      time: '09:20',
      lastUpdate: '5 days ago',
      messages: [
        {
          sender: 'user',
          name: 'John Doe',
          avatar: 'https://picsum.photos/id/1005/40/40',
          message: 'I used the promo code WELCOME100 but didn\'t receive the bonus. Can you apply it to my account?',
          timestamp: '2023-05-10 09:20'
        },
        {
          sender: 'support',
          name: 'Support Agent',
          avatar: 'https://picsum.photos/id/1010/40/40',
          message: 'I apologize for the inconvenience. I\'ve checked your account and it appears there was a system error. I\'ve manually applied the bonus of $100 to your account. You should see it reflected in your balance now.',
          timestamp: '2023-05-10 10:30'
        },
        {
          sender: 'user',
          name: 'John Doe',
          avatar: 'https://picsum.photos/id/1005/40/40',
          message: 'I can see the bonus now. Thank you for your help!',
          timestamp: '2023-05-10 10:45'
        },
        {
          sender: 'support',
          name: 'Support Agent',
          avatar: 'https://picsum.photos/id/1010/40/40',
          message: 'You\'re welcome! Is there anything else I can assist you with?',
          timestamp: '2023-05-10 11:00'
        },
        {
          sender: 'user',
          name: 'John Doe',
          avatar: 'https://picsum.photos/id/1005/40/40',
          message: 'No, that\'s all. Thank you!',
          timestamp: '2023-05-10 11:15'
        }
      ]
    }
  ];
  
  // FAQ data
  const faqCategories = [
    {
      id: 'account',
      title: 'Account & Registration',
      questions: [
        {
          id: 'q1',
          question: 'How do I create an account?',
          answer: 'To create an account, click the "Sign Up" button located below the "Sign In" button. Enter your mobile number and password, agree to our terms and conditions, and verify your mobile number using an OTP (One-Time Password). Once completed, your account will be successfully created.'
        },
        {
          id: 'q2',
          question: 'How do I reset my password?',
          answer: "Click on the 'Forgot Password' link on the login page. Enter the mobile number associated with your account, and we’ll send you an OTP to verify your identity. Once verified, you'll be able to set a new password."
        }
      ]
    },
    {
      id: 'payments',
      title: 'Deposits & Withdrawals',
      questions: [
        {
          id: 'q4',
          question: 'What payment methods are available?',
          answer: 'We accept various payment methods, including credit/debit cards (BDO, BPI, PNB, RCBC, CBC) and e-wallets (GCash, Maya).'
        },
        {
          id: 'q5',
          question: 'How long do withdrawals take?',
          answer: 'Withdrawals are usually processed immediately or within a few minutes.'
        },
        {
          id: 'q6',
          question: 'Is there a minimum or maximum withdrawal amount?',
          answer: 'Yes, the minimum withdrawal amount is ₱100, with an additional ₱6 withdrawal charge.'
        }
      ]
    },
    {
      id: 'games',
      title: 'Games & Betting',
      questions: [
        
        {
          id: 'q8',
          question: 'What happens if I lose connection during a game?',
          answer: 'If you lose connection during a game, our system will attempt to reconnect you automatically. If reconnection is successful, you can continue your game from where you left off. If reconnection fails, the outcome depends on the game type - some games will auto-play your hand, while others may void the current round.'
        },
        {
          id: 'q9',
          question: 'Are the games fair?',
          answer: 'Yes, all our games are based on the official PCSO draw, ensuring fairness and transparency in every result.'
        }
      ]
    }
  ];
  
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  
  const handleContactFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleContactFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the form to an API
    alert('Your message has been sent. Our support team will get back to you soon.');
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    });
  };
  
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the ticket to an API
    alert('Your support ticket has been created. We will respond shortly.');
    setSubject('');
    setMessage('');
  };

  const isMessengerWebview = useBrowserCheck();
    
  if (isMessengerWebview) {
      return <div> <OpenInExternalBrowser/> </div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button 
            onClick={e => {
            e.preventDefault();
            window.location.href = "/dashboard";
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Dashboard
          </button>
          
          <h1 className="text-xl font-bold text-center flex-1">Customer Support</h1>
          
          <div className="w-[60px]"></div> {/* Spacer for balance */}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
          <div className="flex justify-around items-center py-2">
              <Link 
                  to="/dashboard" 
                  className="flex flex-col items-center p-2 text-gray-500"
                  onClick={e => {
                  e.preventDefault();
                  window.location.href = "/dashboard";
                  }}
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span className="text-xs mt-1">Home</span>
              </Link>
              <Link to="/my-bets" className="flex flex-col items-center p-2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="8" ry="3"></ellipse>
                    <path d="M4 5v6a8 3 0 0 0 16 0V5"></path>
                    <path d="M4 11v6a8 3 0 0 0 16 0v-6"></path>
                    </svg>
                    <span className="text-xs mt-1">My Bets</span>
              </Link>
              <Link to="/drawhistory" className="flex flex-col items-center p-2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                      <path d="M4 22h16"></path>
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                    </svg>
                    <span className="text-xs mt-1">Draws</span>
              </Link>
              <Link to="/support" className="flex flex-col items-center p-2 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 17h.01"></path>
                <path d="M12 13a3 3 0 1 0-3-3"></path>
                </svg>
                <span className="text-xs mt-1">Support</span>
              </Link>
              {/* <Link to="/pisoplaysguide" className="flex flex-col items-center p-2 text-gray-500" onClick={() => navigate('/pisoplaysguide')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-book-heart-icon lucide-book-heart">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/>
              <path d="M12 17h.01"></path>
              <path d="M10 8a2 2 0 1 1 2 2c0 1-2 1.5-0 3"></path>
              </svg>
                <span className="text-xs mt-1">Help Guide</span>
              </Link> */}
          </div>
        </div>

        {/* Support Banner */}
        <div className="relative rounded-xl overflow-hidden mb-6 bg-gradient-to-r from-blue-600 to-indigo-600">
          <img 
            src="https://picsum.photos/id/1068/1200/300" 
            alt="Support Banner" 
            className="w-full h-52 object-cover mix-blend-overlay opacity-50"
          />
          <div className="absolute inset-4 p-6 flex flex-col justify-center text-white mt-4">
            <h1 className="text-2xl font-bold mb-2">How Can We Help You?</h1>
            <p className="mb-4 max-w-lg">Our support team is here to assist you with any questions or issues you may have.</p>
            <div className="flex gap-3">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 mb-6" onClick={() => window.open('https://tawk.to/chat/67f4c61c846b7b190fd1ea14/1ioa2bnq9', '_blank', 'noopener,noreferrer')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Live Chat
              </Button>
            </div>
          </div>
        </div>
        
        {/* Support Tabs */}
        <Tabs defaultValue="faq" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find answers to common questions about our platform.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="account">
                  <TabsList className="grid w-full grid-cols-3">
                    {faqCategories.map(category => (
                      <TabsTrigger key={category.id} value={category.id} className="flex-wrap text-center whitespace-pre-wrap sm:whitespace-normal">{category.title} </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  {faqCategories.map(category => (
                    <TabsContent key={category.id} value={category.id} className="mt-8">
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map(item => (
                          <AccordionItem key={item.id} value={item.id}>
                            <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                            <AccordionContent>
                              <p className="text-gray-600">{item.answer}</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-gray-500">Can't find what you're looking for?</p>
                <Button variant="outline" onClick={() =>  window.open('https://tawk.to/chat/67f4c61c846b7b190fd1ea14/1ioa2bnq9', '_blank', 'noopener,noreferrer')}>Contact Support</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Submit a new support request</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="account">Account Issues</SelectItem>
                        <SelectItem value="payment">Payment & Withdrawals</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Input 
                      id="subject" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea 
                      id="message" 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please provide details about your inquiry or issue..."
                      rows={6}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Attachments (Optional)</label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <p className="text-sm text-gray-500">Drag & drop files here or click to browse</p>
                      <p className="text-xs text-gray-400 mt-1">Max file size: 10MB</p>
                      <Input type="file" className="hidden" />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">Submit Ticket</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Help Center Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">User Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Comprehensive guides to help you navigate our platform and make the most of your experience.</p> */}
                {/* <Button variant="outline" className="w-full">View Guides</Button> */}
                
                  {/* <Link to="/pisoplaysguide"
                    className="w-full inline-block text-center bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 font-bold"
                  >
                    View Guides
                  </Link>

              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Video Tutorials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Watch step-by-step video tutorials on how to use various features of our platform.</p>
                <a
                  href="https://www.youtube.com/@PisoPlayPH"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-block text-center bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100 font-bold"
                >
                  Watch Videos
                </a>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Community Forum</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Join our community forum to connect with other users, share experiences, and get help.</p>
                <Button variant="outline" className="w-full">Join Forum</Button>
              </CardContent>
            </Card>
          </div>
        </div> */}
      </main>
    </div>
  );
}