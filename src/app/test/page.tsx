"use client"

import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Article } from "@/types/article"

export default function TestPage() {
  const { toast } = useToast()

  const articles: Article[] = [
    {
      id: "faq",
      title: "FAQ",
      content: "Q. Who do I notify if I'm stuck on a call at the end of my shift?\nA. It is imperative to update it in NICE as well, the OT:Incidental can be added through the “Add Activity” button. Indicate the time your shift was over, the time you finished your last call and the PNR in which you were stuck on.\n\nQ. What happens if I'm running 5 mins late for work?\nA. As per ART. 6.08.06, we are able to flex up to 15 minutes after the start of shift, for example start time is 0900-1700, you are able to start anytime between 0900-0915. If flexing, be sure to also add to the end time of your shift. If there are any restrictions on flex start times, the Company will advise at the start of a new bid. Please also keep in mind, there is NO late or early flexing during training.\n\nQ. I was involuntary scheduled off on a statutory holiday how does this affect my pay?\nA. Art.13.02 Employees will be advised by posted bulletin listing each employee affected, at least twenty-one (21) days in advance of the Statutory Holiday, if the employee is not required to work on any Statutory Holiday, or, which day is being assigned as the day off with pay in accordance with Article 13.02.01. Failing such notice, the employees will be entitled to work as scheduled.\n\nQ. If I'm forced off on Christmas and New Year's Day will I still be eligible to receive the holiday travel pass incentive?\nA. If you are scheduled off on Christmas and New Year's Day by the company (a Santa icon on placed on your shift in total view) you will not be entitled to the holiday passes. However, you could pick up a shift to receive a holiday travel pass. Please note only a complete scheduled shift is eligible for the holiday passes, a partial, or a combination of partials will be qualify. If you apply for RO on a eligible shift, you will still qualify for the C1 Holiday passes.\n\nQ. I noticed on my paycheque that I did not get credited the shift premium for working between 2300-0500. Who do I contact?\nA. Art.5.08 – 4% Shift premiums is paid for all hours worked between 2300 and 0500. If this is not reflected on your paycheque please send an email to res.operationsyyz@aircanada.ca to be corrected.\n\nQ. What is the process to call in sick or late for a shift?\nA. If your calling in sick or will be late for your shift, please call the Sick Line at 1 (800) 755-6906 option 2. Please leave your name, employee number, date and the reason for your call. For example: if you're sick you will use a Sick Day.\n\nQ. I noticed I didn't receive my annual pay increase, who do I contact?\nA. Any discrepancy in your pay cheques please contact the Employee Care Team at:\n\nTelephone: 1-833-847-367 or Email: people.employes@aircanada.ca.\n\nQ. I noticed there's an error on my Employee Travel Profile. How do I get this corrected?\nA. If you noticed any errors in your Employee Travel Profile or you're having issues with the pricing with Employee Travel. Please contact the Travel Care Team at: Telephone: 1 (833) 847-3675 8am – 6pm ET, Monday – Friday (Closed Sat-Sun, public holidays) Email: actravel.voyageac@aircanada.ca Anywhere in North America.\n\nQ. I have a specialist appointment in the middle of my shift and unable to get a partial. What should I do?\nA. Please try to shift trade the required time off. If you are unsuccessful, then send an email to your manager requesting AP to attend your medical appointment. Please remember to always cc the union in all communications with the Company.\n\nQ. I'm having issues signing into the computer at the beginning of my shift. What should I do?\nA. If you are unable to sign into HARMONY at the beginning of your shift, please contact your local manager if you are working in the office. If you are working from home, please contact YUL OPS at 1(800)755-6906, Option 2, and send an email to Cathy at res.operations-yul@aircanada.ca\n\nFor telework agents, as a first step, please reach out to the YUL OPS at 1(800)755-6906, who will troubleshoot with you and provide further instructions. If your call is not answered, please leave them a voicemail advising of your issues and how to best reach you and proceed to calling the IT Service Desk (1-866-274-5444, then press 7 after language selection). Please note that if the issues is not resolved within 30 minutes, or if you did not receive a callback from an Ops Manager during that same time, please contact an on duty CSM. You may be requested to return to the office within 120 minutes (includes getting ready and travel time) to complete your shift.\n\nQ. What steps should I take if I need to go on OFFLINE ACTIVITY to call a Customer back or work on a difficult file?\nA. If you need to be on OFFLINE ACTIVITY to call a customer back or to work on a file, note the time you went offline, the time you finished the file, the PNR and send an email to res.operationsyyz@aircanada.ca and cc your local manager to be adjusted.\n\nQ. My computer is frozen or is glitching, who do I notify?\nA. If you are in the middle of a file and your computer freezes, or is glitching, please contact YUL OPS at 1(800)755-6906 and Option 2.\n\nQ. How do I apply for Family Responsibility Day (FR DAY)\nA. To request an FR Day, call the attendance line at 1(800)755-6906, Option 1, and indicate the reason and the person it pertains to (your dependant/non dependant child, spouse, or parent). If you are still unclear, please contact the local union office. Please refer to the following for the parameters around reasons that qualify for FR Days:\n\nFor the purpose of Sections 174.1 & 206.6 (1) b), carrying out responsibilities related to the health or care of their family members would include activities such as, but not limited to:\n\nAccompanying the family member to an appointment with a health care practitioner\nAccompanying the family member to a surgery\nAccompanying the family member to the hospital or other medical institutions (i.e. labs, clinics) to undergo scheduled medical tests\nPicking up the family member from school due to an illness, injury or medical emergency\nTaking care of a young child for a day following an unexpected school or daycare closure\nTaking care of a sick or injured family member at home\nMaking arrangements for a family members long-term care\nHelping move an elderly family member into a more suitable residence\n\nQ. I'm currently working at RES/CJM and have requested a transfer to the Airport. What should I know?\nA. As per ART. 12.01.02.03 Where a change of location or base is involved, the applicant has served in their present location for at least twelve (12) months. Please keep in mind if you choose to place your name on a transfer list (under HR Connex) be sure that your transfer is valid by renewing your transfer before it expires (every 12 months). Once a vacancy becomes available, you will be notified and given twenty-four (24) months from date of entry.\n\nAs per ART.12.02.03 New hires to a Call Centre and transfers from Airports, Customer Relations and CJM under Articles 12.01 and/or 12.02 to a Call Centre must remain in Call Centres for a minimum of twenty-four (24) months from date of entry.\n\nIf you were recalled from layoff, your residency is 12 months.",
      date: new Date().toISOString(),
      images: [],
      visitors: [],
      genInfo: true
    },
    {
      id: "messages-from-district-chair",
      title: "Messages From District Chair",
      content: "Greetings everyone\n\nTO BE UPDATED.\n\nPlease check our local website at www.uniford300.org for updates.\n\nYour Vice Chair Representatives:\n\n- Carmen Zuloaga\n- Diana Bohorquez\n- Maria Amelia Novello\n- Maria Carmen Farrugia\n- Navneet Pannu\n- Ravindra Samala\n- Sadeek Hassan\n- Yolanda Cornwall\n- Zulima Alvarez\nYour Health and Safety Representatives:\n\n- Wilson Feng\n- Natalia Torres-Restrepo\n- Lucy Daher\nhealthsafety@uniford300.org\n\nYour Women's Advocate\n\nYolanda Cornwall\nPhone: 647-613-0277\n\nEmail: yolanda@unifor2002.org\n\nAre all here to support you as well.\n\nIn Solidarity,\nAdriana Robinson",
      date: new Date().toISOString(),
      images: [],
      visitors: [],
      genInfo: true
    }
  ]

  const handleClick = () => {
    toast({
      title: "Test Toast",
      description: "This is a test notification",
      variant: "default",
    })

    fetch("/api/test", {
      method: "POST",
      body: JSON.stringify(articles)
    })
  }

  return (
    <div className="container mx-auto p-8">
      <Button onClick={handleClick} className="mb-8">
        Show Toast
      </Button>
    </div>
  )
}
