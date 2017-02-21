var db = require("./models");

var billList =[];
billList.push({
              title: 'H.R. 899 - To terminate the Department of Education',
              summary: 'To terminate the Department of Education.',
              sponsor: 'Rep. Massie, Thomas [R-KY-4]',
              textUrl: 'https://www.congress.gov/115/bills/hr899/BILLS-115hr899ih.pdf',
              latestAction: '02/07/2017 Referred to the House Committee on Education and the Workforce',
              issues: ['Dept of Education']
            });
billList.push({
              title: 'H.R.483 - No Funding for Sanctuary Campuses Act',
              summary: 'To amend title IV of the Higher Education Act of 1965 to prohibit the provision of funds under such title to institutions of higher education that violate the immigration laws, and for other purposes.',
              sponsor: 'Rep. Hunter, Duncan D. [R-CA-50]',
              textUrl: 'https://www.congress.gov/115/bills/hr483/BILLS-115hr483ih.pdf',
              latestAction: '01/12/2017 Referred to the House Committee on Education and the Workforce.',
              issues: ['Vouchers', 'Funding']
            });
billList.push({
              title: 'H.R.610 - To distribute Federal funds for elementary and secondary education in the form of vouchers for eligible students and to repeal a certain rule relating to nutrition standards in schools.',
              summary: "Choices in Education Act of 2017. This bill repeals the Elementary and Secondary Education Act of 1965 and limits the authority of the Department of Education (ED) such that ED is authorized only to award block grants to qualified states. The bill establishes an education voucher program, through which each state shall distribute block grant funds among local educational agencies (LEAs) based on the number of eligible children within each LEAs geographical area. From these amounts, each LEA shall: (1) distribute a portion of funds to parents who elect to enroll their child in a private school or to home-school their child, and (2) do so in a manner that ensures that such payments will be used for appropriate educational expenses. To be eligible to receive a block grant, a state must: (1) comply with education voucher program requirements, and (2) make it lawful for parents of an eligible child to elect to enroll their child in any public or private elementary or secondary school in the state or to home-school their child. No Hungry Kids Act. The bill repeals a specified rule that established certain nutrition standards for the national school lunch and breakfast programs. (In general, the rule requires schools to increase the availability of fruits, vegetables, whole grains, and low-fat or fat free milk in school meals; reduce the levels of sodium, saturated fat, and trans fat in school meals; and meet children's nutritional needs within their caloric requirements.)",
              sponsor: 'Rep. King, Steve [R-IA-4]',
              textUrl: 'https://www.congress.gov/115/bills/hr610/BILLS-115hr610ih.pdf',
              latestAction: ' 01/23/2017 Referred to the House Committee on Education and the Workforce.',
              issues: ['Vouchers', 'Affordability', 'Funding']
            });
billList.push({
              title: 'H.R.675 - Empowering Parents to Invest in Choice Act of 2017',
              summary: "Empowering Parents to Invest in Choice Act of 2017. This bill amends the Internal Revenue Code to allow the payment of qualified elementary and secondary education expenses from a tax-exempt qualified tuition program (known as a 529 plan). (Currently, such plans only pay qualified higher education expenses.) Included as qualified elementary and secondary education expenses are expenses for: (1) tuition, fees, academic tutoring, special needs services, books, and supplies; (2) room and board, uniforms, transportation, and supplementary items and services; and (3) and computer technology or equipment, including Internet access. The bill also increases from $2,000s on the frequency of investment directions that a beneficiary or contributor may provide for a 529 or ABLE account, rebalancing investments among broad-based investment strategies established under the program is not an investment direction unless the beneficiary or contributor directs the specific investments within the strategies.",
              sponsor: 'Rep. Jenkins, Lynn [R-KS-2]',
              textUrl: 'https://www.congress.gov/115/bills/hr529/BILLS-115hr529ih.pdf',
              latestAction: '01/13/2017 Referred to the House Committee on Ways and Means.',
              issues: ['Affordability', 'Funding']
            });
billList.push({
              title: 'H.R. 529 - To amend the Internal Revenue Code of 1986 to make improvements in the rules related to qualified tuition programs and qualified ABLE programs.',
              summary: "This bill amends the Internal Revenue Code to modify the tax treatment of qualified tuition programs (known as 529 plans) and ABLE accounts. (Tax-favored ABLE [Achieving a Better Life Experience] accounts are designed to enable individuals with disabilities to save for and pay for disability-related expenses.) The bill excludes from gross income a fringe benefit consisting of up to $100 per year (adjusted for inflation after 2017) of employer contributions to an employee's 529 or ABLE account. The employer contribution must be made: (1) to an account for which the designated beneficiary is the employee or a member of the employee's family, and (2) in connection with a payroll deduction contribution program established by the employer. The bill also: (1) expands the tax credit for small employer pension plan startup costs to include the costs of establishing a payroll deduction contribution program for 529 plans and ABLE accounts, (2) permits 529 funds to be used for education loan payments or charitable contributions without being subject to the additional tax for distributions that are not used for qualified higher education expenses, and (3) permits tax-free rollovers of funds between 529 and ABLE accounts for the benefit of the same beneficiary or a family member of the beneficiary. For the purpose of current law restrictions on the frequency of investment directions that a beneficiary or contributor may provide for a 529 or ABLE account, rebalancing investments among broad-based investment strategies established under the program is not an investment direction unless the beneficiary or contributor directs the specific investments within the strategies.",
              sponsor: 'Rep. Jenkins, Lynn [R-KS-2]',
              textUrl: 'https://www.congress.gov/115/bills/hr529/BILLS-115hr529ih.pdf',
              latestAction: '01/13/2017 Referred to the House Committee on Ways and Means',
              issues: ['Student Loans', 'Funding']
});

var actionItems = [];

actionItems.push({ title: 'Call Your Representative',
                   rep1Name: 'Senator Dianne Feinstein',
                   rep2Name: 'Senator Kamala Harris',
                   rep3Name: 'Congressmember Zoe Lofgren',
                   rep1ActionUrl: '1-415-393-0707',
                   rep2ActionUrl: '1-415-355-9041',
                   rep3ActionUrl: '1-408-271-8700',
                   dueDate: 'February 21, 2017',
                   status: false
                 });
actionItems.push({ title: 'Email Your Representative',
                    rep1Name: 'Senator Dianne Feinstein',
                    rep2Name: 'Senator Kamala Harris',
                    rep3Name: 'Congressmember Zoe Lofgren',
                    rep1ActionUrl: 'https://www.feinstein.senate.gov/public/index.cfm/e-mail-me',
                    rep2ActionUrl: 'https://www.harris.senate.gov/content/contact-senator',
                    rep3ActionUrl: 'https://lofgren.house.gov/contact/',
                    dueDate: 'February 23, 2017',
                    status: false
                 });
actionItems.push({ title: 'Write to Your Representative',
                   rep1Name: 'Senator Dianne Feinstein',
                   rep2Name: 'Senator Kamala Harris',
                   rep3Name: 'Congressmember Zoe Lofgren',
                   rep1ActionUrl: 'One Post Street, Suite 2450, San Francisco, CA 94104',
                   rep2ActionUrl: '50 United Nations Plaza, Suite 5584, San Francisco, CA  94102',
                   rep3ActionUrl: '635 North 1st Street, Suite B, San Jose, CA 95112',
                   dueDate: 'February 22,2017',
                   status: false
                 });

// add all action items to each album's action items list
billList.forEach(function(bill) {
  bill.actionItems = actionItems;
});

db.bill.remove({}, function(err, bills){
  db.bill.create(billList, function(err, bills){
    if (err) { return console.log('ERROR', err); }
    process.exit();
  });
});
