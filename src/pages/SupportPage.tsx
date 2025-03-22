import { useState } from 'react';
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

export function SupportPage() {
  const navigate = useNavigate();
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [category, setCategory] = useState('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('faq');
  
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
          answer: 'To create an account, click on the "Sign Up" button in the top right corner of the homepage. Fill in your personal details, create a username and password, and agree to our terms and conditions. Once you\'ve completed these steps, your account will be created.'
        },
        {
          id: 'q2',
          question: 'Why do I need to verify my account?',
          answer: 'Account verification is required to comply with regulatory requirements and to ensure the security of your account. Verification helps prevent fraud and money laundering, and allows us to protect your account and funds.'
        },
        {
          id: 'q3',
          question: 'How do I reset my password?',
          answer: 'To reset your password, click on the "Forgot Password" link on the login page. Enter the email address associated with your account, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password.'
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
          answer: 'We accept various payment methods including credit/debit cards (Visa, Mastercard), e-wallets (PayPal, Skrill, Neteller), bank transfers, and cryptocurrencies (Bitcoin, Ethereum). Available methods may vary depending on your location.'
        },
        {
          id: 'q5',
          question: 'How long do withdrawals take?',
          answer: 'Withdrawal processing times vary depending on the payment method. E-wallets typically process within 24 hours, credit/debit cards within 3-5 business days, and bank transfers within 5-7 business days. Cryptocurrency withdrawals are usually processed within a few hours.'
        },
        {
          id: 'q6',
          question: 'Is there a minimum or maximum withdrawal amount?',
          answer: 'Yes, the minimum withdrawal amount is $10 for most payment methods. Maximum withdrawal limits vary depending on your account level and payment method. You can view your specific limits in the Cashier section of your account.'
        }
      ]
    },
    {
      id: 'games',
      title: 'Games & Betting',
      questions: [
        {
          id: 'q7',
          question: 'How do I join a tournament?',
          answer: 'To join a tournament, navigate to the Tournaments section from the main menu. Browse available tournaments and click on the one you\'re interested in. Review the tournament details, entry fee, and rules, then click the "Register" or "Join" button to participate.'
        },
        {
          id: 'q8',
          question: 'What happens if I lose connection during a game?',
          answer: 'If you lose connection during a game, our system will attempt to reconnect you automatically. If reconnection is successful, you can continue your game from where you left off. If reconnection fails, the outcome depends on the game type - some games will auto-play your hand, while others may void the current round.'
        },
        {
          id: 'q9',
          question: 'Are the games fair?',
          answer: 'Yes, all our games use certified Random Number Generators (RNGs) to ensure fair and random outcomes. Our platform is regularly audited by independent testing agencies to verify the fairness and integrity of our games. You can view our certification details in the footer of our website.'
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
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <button 
            onClick={() => navigate('/dashboard')}
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
              <Link to="/dashboard" className="flex flex-col items-center p-2 text-gray-500">
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
              <Link to="/tournaments" className="flex flex-col items-center p-2 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                      <path d="M4 22h16"></path>
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                    </svg>
                    <span className="text-xs mt-1">Tournaments</span>
              </Link>
              <Link to="/support" className="flex flex-col items-center p-2 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 17h.01"></path>
                <path d="M12 13a3 3 0 1 0-3-3"></path>
                </svg>
                <span className="text-xs mt-1">Support</span>
              </Link>
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
              <Button className="bg-white text-blue-600 hover:bg-gray-100 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Live Chat
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10 mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Contact Us
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Contact Support</DialogTitle>
                  </DialogHeader>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="dialog-email" className="text-sm font-medium">Email Address</label>
                      <Input id="dialog-email" type="email" placeholder="your@email.com" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="dialog-subject" className="text-sm font-medium">Subject</label>
                      <Input id="dialog-subject" placeholder="Brief description of your issue" required />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="dialog-message" className="text-sm font-medium">Message</label>
                      <Textarea id="dialog-message" placeholder="Please provide details about your inquiry or issue..." rows={4} required />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Send Message</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        
        {/* Support Tabs */}
        <Tabs defaultValue="faq" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="contact">Contact Us</TabsTrigger>
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
                <Button variant="outline" onClick={() => setActiveTab('contact')}>Contact Support</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="tickets">
            <Card>
              <CardHeader>
                <CardTitle>My Support Tickets</CardTitle>
                <CardDescription>View and manage your support requests</CardDescription>
              </CardHeader>
              <CardContent>
                {supportTickets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Ticket List */}
                    <div className="md:col-span-1 border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-3 border-b">
                        <h3 className="font-medium">Ticket History</h3>
                      </div>
                      <ScrollArea className="h-[400px]">
                        <div className="divide-y">
                          {supportTickets.map(ticket => (
                            <div 
                              key={ticket.id}
                              className={`p-3 cursor-pointer hover:bg-gray-50 transition-colors ${activeTicket === ticket.id ? 'bg-blue-50' : ''}`}
                              onClick={() => setActiveTicket(ticket.id)}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <h4 className="font-medium">{ticket.subject}</h4>
                                <Badge 
                                  className={
                                    ticket.status === 'open' 
                                      ? 'bg-green-100 text-green-800' 
                                      : ticket.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }
                                >
                                  {ticket.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-500 mb-1">
                                ID: {ticket.id} • {ticket.date}
                              </div>
                              <div className="text-xs text-gray-400">
                                Last updated: {ticket.lastUpdate}
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>


                    
                    {/* Ticket Details */}
                    <div className="md:col-span-2 border rounded-lg overflow-hidden">
                      {activeTicket ? (
                        <>
                          {(() => {
                            const ticket = supportTickets.find(t => t.id === activeTicket);
                            if (!ticket) return null;
                            
                            return (
                              <>
                                <div className="bg-gray-50 p-3 border-b flex justify-between items-center">
                                  <div>
                                    <h3 className="font-medium">{ticket.subject}</h3>
                                    <div className="text-sm text-gray-500">
                                      {ticket.id} • {ticket.date} {ticket.time}
                                    </div>
                                  </div>
                                  <Badge 
                                    className={
                                      ticket.status === 'open' 
                                        ? 'bg-green-100 text-green-800' 
                                        : ticket.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }
                                  >
                                    {ticket.status}
                                  </Badge>
                                </div>
                                
                                <ScrollArea className="h-[300px] p-4">
                                  <div className="space-y-4">
                                    {ticket.messages.map((msg, idx) => (
                                      <div 
                                        key={idx} 
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                      >
                                        <div 
                                          className={`max-w-[80%] rounded-lg p-3 ${
                                            msg.sender === 'user' 
                                              ? 'bg-blue-100 text-blue-800' 
                                              : 'bg-gray-100 text-gray-800'
                                          }`}
                                        >
                                          <div className="flex items-center gap-2 mb-1">
                                            <Avatar className="h-6 w-6">
                                              <AvatarImage src={msg.avatar} alt={msg.name} />
                                              <AvatarFallback>{msg.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm font-medium">{msg.name}</span>
                                            <span className="text-xs text-gray-500">{msg.timestamp}</span>
                                          </div>
                                          <p className="text-sm">{msg.message}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                                
                                {ticket.status !== 'closed' && (
                                  <div className="p-3 border-t">
                                    <form className="flex gap-2">
                                      <Textarea 
                                        placeholder="Type your reply..." 
                                        className="min-h-[60px]"
                                      />
                                      <Button type="submit" className="shrink-0">
                                        Send
                                      </Button>
                                    </form>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mb-4">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                          </svg>
                          <h3 className="text-lg font-medium text-gray-700 mb-2">Select a Ticket</h3>
                          <p className="text-gray-500">Choose a ticket from the list to view its details</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-400 mb-4">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Support Tickets</h3>
                    <p className="text-gray-500 mb-4">You haven't created any support tickets yet</p>
                    <Button onClick={() => setActiveTab('contact')}>Create a Ticket</Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setActiveTab('contact')}
                >
                  Create New Ticket
                </Button>
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
        
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Help Center Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">User Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Comprehensive guides to help you navigate our platform and make the most of your experience.</p>
                <Button variant="outline" className="w-full">View Guides</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Video Tutorials</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Watch step-by-step video tutorials on how to use various features of our platform.</p>
                <Button variant="outline" className="w-full">Watch Videos</Button>
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
        </div>
      </main>
    </div>
  );
}