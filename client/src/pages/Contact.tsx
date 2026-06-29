import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { submitContactForm, ContactFormData } from "@/api/contact";
import { useToast } from "@/hooks/useToast";

const steps = [
  { title: "Basic Information", description: "Tell us about yourself" },
  { title: "Company Details", description: "Your company information" },
  { title: "Project Details", description: "What can we help you with?" },
];

export function Contact() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm<ContactFormData>();


  const nextStep = async () => {
    let fieldsToValidate: (keyof ContactFormData)[] = [];

    if (currentStep === 0) {
      fieldsToValidate = ["name", "email"];
    } else if (currentStep === 1) {
      fieldsToValidate = ["company", "country", "jobTitle"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting contact form:", data);
      const response = (await submitContactForm(data)) as {
        success: boolean;
        message: string;
        confirmationNumber: string;
      };

      if (response.success) {
        setConfirmationNumber(response.confirmationNumber);
        setIsSubmitted(true);
        toast({
          title: "Form Submitted Successfully!",
          description: response.message,
        });
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Submission Failed",
        description:
          error instanceof Error ? error.message : "Failed to submit form",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  if (isSubmitted) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center ">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <Card className="text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Thank You!
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                Your inquiry has been submitted successfully. We'll get back to
                you within 24 hours.
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Confirmation Number:{" "}
                  <span className="font-mono font-semibold">
                    {confirmationNumber}
                  </span>
                </p>
              </div>
              <Link to="/">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg border border-indigo-400/30">
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Ready to transform your business with innovative software solutions?
            Let's discuss your project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  Get Started
                </CardTitle>
                <div className="space-y-4">
                  <Progress value={progress} className="w-full" />
                  <div className="flex justify-between text-sm">
                    {steps.map((step, index) => (
                      <div
                        key={index}
                        className={`flex-1 text-center ${
                          index <= currentStep
                            ? "text-blue-600"
                            : "text-slate-400"
                        }`}
                      >
                        <div className="font-medium">{step.title}</div>
                        <div className="text-xs">{step.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Step 1: Basic Information */}
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          {...register("name", {
                            required: "Name is required",
                          })}
                          className="mt-1"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: "Invalid email address",
                            },
                          })}
                          className="mt-1"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          {...register("phone")}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Company Details */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="company">Company Name *</Label>
                        <Input
                          id="company"
                          {...register("company", {
                            required: "Company name is required",
                          })}
                          className="mt-1"
                        />
                        {errors.company && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.company.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Select
                          onValueChange={(value) => setValue("country", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="de">Germany</SelectItem>
                            <SelectItem value="fr">France</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.country && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.country.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="jobTitle">Job Title *</Label>
                        <Input
                          id="jobTitle"
                          {...register("jobTitle", {
                            required: "Job title is required",
                          })}
                          className="mt-1"
                        />
                        {errors.jobTitle && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.jobTitle.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Project Details */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="jobDetails">Project Details *</Label>
                        <Textarea
                          id="jobDetails"
                          {...register("jobDetails", {
                            required: "Project details are required",
                          })}
                          placeholder="Please describe your project requirements, goals, and any specific features you need..."
                          className="mt-1 min-h-[120px]"
                        />
                        {errors.jobDetails && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.jobDetails.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="budget">Budget Range</Label>
                        <Select
                          onValueChange={(value) => setValue("budget", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select your budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-5k">
                              Under $5,000
                            </SelectItem>
                            <SelectItem value="5k-10k">
                              $5,000 - $10,000
                            </SelectItem>
                            <SelectItem value="10k-25k">
                              $10,000 - $25,000
                            </SelectItem>
                            <SelectItem value="25k-50k">
                              $25,000 - $50,000
                            </SelectItem>
                            <SelectItem value="50k-100k">
                              $50,000 - $100,000
                            </SelectItem>
                            <SelectItem value="over-100k">
                              Over $100,000
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="timeline">Timeline</Label>
                        <Select
                          onValueChange={(value) => setValue("timeline", value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select your preferred timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asap">ASAP</SelectItem>
                            <SelectItem value="1-2-months">
                              1-2 months
                            </SelectItem>
                            <SelectItem value="3-4-months">
                              3-4 months
                            </SelectItem>
                            <SelectItem value="4-6-months">
                              4-6 months
                            </SelectItem>
                            <SelectItem value="6-months-plus">
                              6+ months
                            </SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* Navigation buttons */}
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>

                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg border border-indigo-400/30"
                      >
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg border border-indigo-400/30"
                      >
                        {isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Address
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      123 Tech Street
                      <br />
                      Silicon Valley, CA 94000
                      <br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Phone
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Email
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      hello@aisolution.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      Business Hours
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      Monday - Friday: 9:00 AM - 6:00 PM
                      <br />
                      Saturday: 10:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-0">
                <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                  <p className="text-slate-500 dark:text-slate-400">
                    Interactive Map Placeholder
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    How long does a typical project take?
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Project timelines vary based on complexity, but most
                    projects take 2-6 months from start to finish.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Do you provide ongoing support?
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Yes, we offer comprehensive support and maintenance packages
                    for all our solutions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    Can you work with our existing systems?
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Absolutely! We specialize in integrating with existing
                    systems and can work with any technology stack.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
