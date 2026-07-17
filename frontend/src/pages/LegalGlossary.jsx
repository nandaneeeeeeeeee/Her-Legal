import { useState } from "react";
import { Search, BookOpen, ChevronDown } from "lucide-react";
import { useLanguage } from "../LanguageContext";
import "./LegalGlossary.css";

const TERMS = [
  { term: 'Affidavit', category: 'Court Procedure', definition: 'A written statement confirmed by oath, used as evidence in court. In Nepal, affidavits must be sworn before a notary public or court officer.', nepali: 'हलफनामा', nepaliDefinition: 'शपथद्वारा पुष्टि गरिएको लिखित कथन, अदालतमा प्रमाणको रूपमा प्रयोग गरिन्छ। नेपालमा, हलफनामा नोटरी सार्वजनिक वा अदालत अधिकारीको सामु शपथ लिनुपर्छ।' },
  { term: 'Alimony', category: 'Family Law', definition: 'Financial support paid by one spouse to another after separation or divorce. Nepali law entitles a wife to alimony if she cannot support herself.', nepali: 'गुजारा भत्ता', nepaliDefinition: 'सम्बन्ध विच्छेद वा पृथकीकरण पछि एक पतिले अर्को पतिलाई भुक्तान गर्ने आर्थिक सहायता। नेपाली कानूनले आफूलाई सम्हाल्न नसक्ने पत्नीलाई गुजारा भत्ता पाउने अधिकार दिन्छ।' },
  { term: 'Bail', category: 'Criminal Law', definition: 'Temporary release of an accused person awaiting trial, often secured by a monetary guarantee. Nepal\'s Muluki Criminal Code governs bail provisions.', nepali: 'जमानत', nepaliDefinition: 'मुद्दाको सुनुवाइको प्रतीक्षामा रहेको अभियुक्तलाई अस्थायी रिहाई, प्रायः मौद्रिक ग्यारेन्टीद्वारा सुरक्षित गरिन्छ। नेपालको मुलुकी फौजदारी संहिताले जमानतसम्बन्धी प्रावधानहरू नियन्त्रण गर्दछ।' },
  { term: 'Benami Transaction', category: 'Property Law', definition: 'A transaction where property is bought in someone else\'s name. Nepal has laws prohibiting benami transactions to prevent money laundering.', nepali: 'बेनामी कारोबार', nepaliDefinition: 'जहाँ सम्पत्ति अर्कै व्यक्तिको नाममा किनिन्छ, त्यस्तो कारोबार। नेपालमा मनी लान्ड्रिङ रोक्न बेनामी कारोबार निषेध गर्ने कानूनहरू छन्।' },
  { term: 'Caveat', category: 'Property Law', definition: 'A legal notice to a court or public officer to prevent certain action (like property transfer) until the person giving notice is heard.', nepali: 'क्याभिएट', nepaliDefinition: 'अदालत वा सार्वजनिक अधिकारीलाई निवेदन दिने व्यक्तिको सुनुवाइ नहुँदासम्म निश्चित कार्य (जस्तै सम्पत्ति हस्तान्तरण) रोक्न दिइने कानुनी सूचना।' },
  { term: 'Child Custody', category: 'Family Law', definition: 'Legal rights and responsibilities regarding the care of a child after parents separate. Nepali courts prioritize the child\'s best interests.', nepali: 'बाल संरक्षण', nepaliDefinition: 'अभिभावकको सम्बन्ध विच्छेदपछि बालबालिकाको हेरचाहसम्बन्धी कानुनी अधिकार र जिम्मेवारीहरू। नेपाली अदालतहरूले बालबालिकाको सर्वोत्तम हितलाई प्राथमिकता दिन्छन्।' },
  { term: 'Civil Suit', category: 'Civil Law', definition: 'A legal case between individuals or organizations regarding rights, property, or money, as opposed to criminal matters.', nepali: 'देवानी मुद्दा', nepaliDefinition: 'अधिकार, सम्पत्ति, वा पैसाको सम्बन्धमा व्यक्ति वा संस्थाहरूबीचको कानुनी मुद्दा, फौजदारी मामिलाको विपरीत।' },
  { term: 'Compensation', category: 'General', definition: 'Payment awarded to someone for loss, injury, or damage suffered. Nepali law provides for compensation in both civil and criminal cases.', nepali: 'क्षतिपूर्ति', nepaliDefinition: 'कसैलाई हानि, चोट, वा क्षति भएकोमा प्रदान गरिने भुक्तानी। नेपाली कानूनले देवानी र फौजदारी दुवै मुद्दामा क्षतिपूर्ति प्रदान गर्दछ।' },
  { term: 'Complaint', category: 'Criminal Law', definition: 'A formal statement made to authorities about an offense. In Nepal, FIRs (First Information Reports) can be filed at any police station.', nepali: 'उजुरी', nepaliDefinition: 'अपराधको बारेमा अधिकारीहरूसमक्ष दिइने औपचारिक कथन। नेपालमा, कुनै पनि प्रहरी चौकीमा जाहेरी दर्ता गर्न सकिन्छ।' },
  { term: 'Consent', category: 'General', definition: 'Voluntary agreement to do something. In legal contexts, consent must be free, informed, and given without coercion or fraud.', nepali: 'सहमति', nepaliDefinition: 'केही गर्न स्वैच्छिक सहमति। कानुनी सन्दर्भमा, सहमति स्वतन्त्र, सूचित, र जबरजस्ती वा धोखा बिनाको हुनुपर्छ।' },
  { term: 'Constitution', category: 'Constitutional Law', definition: 'The supreme law of Nepal that establishes the structure of government and fundamental rights of citizens. Nepal\'s current constitution was adopted in 2015.', nepali: 'संविधान', nepaliDefinition: 'नेपालको सर्वोच्च कानून जसले सरकारको संरचना र नागरिकको मौलिक अधिकार स्थापित गर्दछ। नेपालको हालको संविधान २०७२ मा जारी गरिएको थियो।' },
  { term: 'Contempt of Court', category: 'Court Procedure', definition: 'Action that disrespects or defies a court authority. In Nepal, contempt can lead to fine or imprisonment.', nepali: 'अदालतको अवहेलना', nepaliDefinition: 'अदालतको अधिकारको अपमान वा अवज्ञा गर्ने कार्य। नेपालमा, अवहेलनाले जरिवाना वा कैद हुन सक्छ।' },
  { term: 'Contract', category: 'Civil Law', definition: 'A legally binding agreement between two or more parties. For a contract to be valid in Nepal, it requires offer, acceptance, and consideration.', nepali: 'सम्झौता', nepaliDefinition: 'दुई वा बढी पक्षहरूबीचको कानुनी रूपमा बाध्यकारी सम्झौता। नेपालमा सम्झौता मान्य हुन प्रस्ताव, स्वीकृति, र प्रतिफल आवश्यक हुन्छ।' },
  { term: 'Copyright', category: 'Intellectual Property', definition: 'Legal right protecting original creative works. Nepal\'s Copyright Act protects literary, musical, and artistic works.', nepali: 'प्रतिलिपि अधिकार', nepaliDefinition: 'मौलिक सिर्जनात्मक कार्यहरूको संरक्षण गर्ने कानुनी अधिकार। नेपालको प्रतिलिपि अधिकार ऐनले साहित्यिक, सांगीतिक, र कलात्मक कार्यहरूको संरक्षण गर्दछ।' },
  { term: 'Cross-examination', category: 'Court Procedure', definition: 'Questioning of a witness by the opposing party\'s lawyer to test the truthfulness of their testimony.', nepali: 'जिराह', nepaliDefinition: 'गवाहको बयानको सत्यता परीक्षण गर्न विपक्षी वकिलद्वारा साक्षीलाई प्रश्न गर्ने प्रक्रिया।' },
  { term: 'Decree', category: 'Court Procedure', definition: 'A formal court judgment that determines the rights of parties in a civil case.', nepali: 'आदेश', nepaliDefinition: 'देवानी मुद्दामा पक्षहरूको अधिकार निर्धारण गर्ने अदालतको औपचारिक निर्णय।' },
  { term: 'Defamation', category: 'Civil Law', definition: 'Act of harming someone\'s reputation through false statements. Nepal\'s Muluki Civil Code provides remedies for defamation.', nepali: 'मानहानि', nepaliDefinition: 'झूटो कथनद्वारा कसैको प्रतिष्ठालाई हानि पुर्याउने कार्य। नेपालको मुलुकी देवानी संहिताले मानहानिको लागि उपचार प्रदान गर्दछ।' },
  { term: 'Divorce', category: 'Family Law', definition: 'Legal dissolution of marriage. In Nepal, divorce can be filed by mutual consent or on specific grounds like adultery, cruelty, or desertion.', nepali: 'सम्बन्ध विच्छेद', nepaliDefinition: 'विवाहको कानुनी विघटन। नेपालमा, आपसी सहमतिद्वारा वा व्यभिचार, क्रूरता, वा परित्याग जस्ता विशिष्ट आधारहरूमा सम्बन्ध विच्छेद दायर गर्न सकिन्छ।' },
  { term: 'Domestic Violence', category: 'Criminal Law', definition: 'Physical, emotional, sexual, or economic abuse within a household. Nepal\'s Domestic Violence Act 2066 provides protection orders.', nepali: 'घरेलु हिंसा', nepaliDefinition: 'घरभित्रको शारीरिक, भावनात्मक, यौन, वा आर्थिक दुर्व्यवहार। नेपालको घरेलु हिंसा ऐन २०६६ ले संरक्षण आदेशको प्रावधान राख्दछ।' },
  { term: 'Due Diligence', category: 'Property Law', definition: 'Investigation of a property or business before a transaction. In Nepal, due diligence is essential before buying land or investing.', nepali: 'उचित परीक्षण', nepaliDefinition: 'कारोबार अघि सम्पत्ति वा व्यवसायको जाँच। नेपालमा, जग्गा किन्न वा लगानी गर्नुअघि उचित परीक्षण आवश्यक हुन्छ।' },
  { term: 'Easement', category: 'Property Law', definition: 'A right to use another person\'s land for a specific purpose, like a right of way. Recognized under Nepali land laws.', nepali: 'सुविधा अधिकार', nepaliDefinition: 'अर्को व्यक्तिको जग्गा विशेष प्रयोजनको लागि प्रयोग गर्ने अधिकार, जस्तै बाटो हिँड्ने अधिकार। नेपाली जग्गा कानून अन्तर्गत मान्यता प्राप्त।' },
  { term: 'Evidence', category: 'Court Procedure', definition: 'Information presented in court to prove facts. Nepal\'s Evidence Act governs what types of evidence are admissible.', nepali: 'प्रमाण', nepaliDefinition: 'तथ्य प्रमाणित गर्न अदालतमा प्रस्तुत गरिने जानकारी। नेपालको प्रमाण ऐनले कुन किसिमको प्रमाण स्वीकार्य छ भनी निर्धारण गर्दछ।' },
  { term: 'FIR (First Information Report)', category: 'Criminal Law', definition: 'The initial report of a crime filed with police. In Nepal, anyone can file an FIR at any police station.', nepali: 'प्रारम्भिक जानकारी प्रतिवेदन', nepaliDefinition: 'प्रहरीमा दर्ता गराइने अपराधको प्रारम्भिक रिपोर्ट। नेपालमा, जो कोहीले पनि कुनै पनि प्रहरी चौकीमा उजुरी दिन सक्छ।' },
  { term: 'Fundamental Rights', category: 'Constitutional Law', definition: 'Basic human rights guaranteed by Nepal\'s Constitution, including right to equality, education, health, and justice.', nepali: 'मौलिक हक', nepaliDefinition: 'नेपालको संविधानद्वारा ग्यारेन्टी गरिएका आधारभूत मानव अधिकारहरू, जसमा समानता, शिक्षा, स्वास्थ्य, र न्यायको अधिकार समावेश छ।' },
  { term: 'Guardianship', category: 'Family Law', definition: 'Legal authority to care for a minor child or incapacitated person. Nepali law grants guardianship through the court.', nepali: 'अभिभावकत्व', nepaliDefinition: 'नाबालिग बालबालिका वा असक्षम व्यक्तिको हेरचाह गर्ने कानुनी अधिकार। नेपाली कानूनले अदालतमार्फत अभिभावकत्व प्रदान गर्दछ।' },
  { term: 'Habeas Corpus', category: 'Constitutional Law', definition: 'A legal order requiring a person under arrest to be brought before a judge. It protects against unlawful detention. Guaranteed by Nepal\'s Constitution.', nepali: 'बन्दी प्रत्यक्षीकरण', nepaliDefinition: 'गिरफ्तार व्यक्तिलाई न्यायाधीशको सामु पेश गर्न आवश्यक पर्ने कानुनी आदेश। यसले अवैध हिरासतबाट संरक्षण गर्दछ। नेपालको संविधानद्वारा ग्यारेन्टी गरिएको।' },
  { term: 'Harassment', category: 'Criminal Law', definition: 'Unwanted behavior that intimidates, threatens, or humiliates. Includes workplace sexual harassment, which is prohibited under Nepali law.', nepali: 'उत्पीडन', nepaliDefinition: 'डर, धम्की, वा अपमान गर्ने अनावश्यक व्यवहार। नेपाली कानून अन्तर्गत कार्यस्थलमा यौन उत्पीडन निषेधित छ।' },
  { term: 'Inheritance', category: 'Property Law', definition: 'Property received from a deceased person. Under Nepali law, daughters now have equal inheritance rights to sons.', nepali: 'उत्तराधिकार', nepaliDefinition: 'मृतक व्यक्तिबाट प्राप्त सम्पत्ति। नेपाली कानून अन्तर्गत, छोरीहरूलाई अब छोराहरूको बराबर उत्तराधिकार अधिकार छ।' },
  { term: 'Injunction', category: 'Civil Law', definition: 'A court order requiring someone to do or refrain from doing a specific action. Often used in property disputes.', nepali: 'आदेश', nepaliDefinition: 'कसैलाई विशिष्ट कार्य गर्न वा गर्नबाट रोक्न अदालतको आदेश। प्रायः सम्पत्ति विवादहरूमा प्रयोग गरिन्छ।' },
  { term: 'Jurisdiction', category: 'Court Procedure', definition: 'The official power of a court to hear and decide cases. In Nepal, jurisdiction is determined by geography and case type.', nepali: 'अधिकार क्षेत्र', nepaliDefinition: 'मुद्दा सुनुवाइ र निर्णय गर्ने अदालतको आधिकारिक शक्ति। नेपालमा, अधिकार क्षेत्र भूगोल र मुद्दाको प्रकृतिले निर्धारण गरिन्छ।' },
  { term: 'Land Ceiling', category: 'Property Law', definition: 'Legal limit on the amount of land a person can own. Nepal\'s Land Ceiling Act aims to redistribute land to the landless.', nepali: 'जग्गा जोत', nepaliDefinition: 'एक व्यक्तिले जग्गा राख्न सक्ने अधिकतम सीमा। नेपालको जग्गा जोत ऐनले भूमिहीनहरूलाई जग्गा वितरण गर्ने लक्ष्य राख्दछ।' },
  { term: 'Legal Heir', category: 'Property Law', definition: 'A person legally entitled to inherit property. Under Nepali law, spouse, children, and parents are legal heirs.', nepali: 'कानुनी वारिस', nepaliDefinition: 'सम्पत्ति प्राप्त गर्न कानुनी रूपमा हकदार व्यक्ति। नेपाली कानून अन्तर्गत, पति/पत्नी, बालबालिका, र आमाबुवा कानुनी वारिस हुन्।' },
  { term: 'Litigation', category: 'General', definition: 'The process of taking legal action through the court system. Can be civil or criminal.', nepali: 'मुद्दा मामिला', nepaliDefinition: 'अदालती प्रणालीमार्फत कानुनी कारबाही गर्ने प्रक्रिया। देवानी वा फौजदारी दुवै हुन सक्छ।' },
  { term: 'Maternity Leave', category: 'Employment Law', definition: 'Paid time off from work for childbirth. Nepal\'s Labour Act provides 98 days of paid maternity leave for women.', nepali: 'सुत्केरी बिदा', nepaliDefinition: 'प्रसूतिको लागि कामबाट तलबसहितको बिदा। नेपालको श्रम ऐनले महिलाका लागि ९८ दिनको सुत्केरी बिदाको प्रावधान राख्दछ।' },
  { term: 'Mediation', category: 'Dispute Resolution', definition: 'A process where a neutral third party helps disputing parties reach an agreement. Nepali courts encourage mediation before trial.', nepali: 'मध्यस्थता', nepaliDefinition: 'जहाँ तटस्थ तेस्रो पक्षले विवादित पक्षहरूलाई सम्झौतामा पुर्याउन मद्दत गर्दछ, त्यो प्रक्रिया। नेपाली अदालतहरूले मुद्दा अघि मध्यस्थतालाई प्रोत्साहन दिन्छन्।' },
  { term: 'Minor', category: 'General', definition: 'A person below the legal age of adulthood. In Nepal, a minor is anyone under 18 years old.', nepali: 'नाबालिग', nepaliDefinition: 'कानुनी वयस्कता भन्दा मुनिको व्यक्ति। नेपालमा, १८ वर्ष मुनिका जो कोही नाबालिग हुन्।' },
  { term: 'MOU (Memorandum of Understanding)', category: 'General', definition: 'A non-binding agreement between parties outlining their understanding. Often a precursor to a formal contract.', nepali: 'सम्झौता पत्र', nepaliDefinition: 'पक्षहरूबीचको समझदारीको रूपरेखा प्रस्तुत गर्ने गैर-बाध्यकारी सम्झौता। प्रायः औपचारिक सम्झौताको अग्रदूतको रूपमा।' },
  { term: 'Natural Justice', category: 'General', definition: 'Basic principles of fairness in legal proceedings, including the right to be heard and the right to an impartial decision-maker.', nepali: 'नैसर्गिक न्याय', nepaliDefinition: 'कानुनी कारबाहीमा निष्पक्षताका आधारभूत सिद्धान्तहरू, जसमा सुनुवाइको अधिकार र निष्पक्ष निर्णयकर्ताको अधिकार समावेश छ।' },
  { term: 'Notary', category: 'General', definition: 'A public officer authorized to certify documents and administer oaths. In Nepal, notarization is required for many legal documents.', nepali: 'नोटरी', nepaliDefinition: 'कागजातहरू प्रमाणित गर्न र शपथ गराउन अधिकृत सार्वजनिक अधिकारी। नेपालमा, धेरै कानुनी कागजातहरूको लागि नोटरीकरण आवश्यक हुन्छ।' },
  { term: 'Order', category: 'Court Procedure', definition: 'A directive from a court requiring action or inaction. Less formal than a judgment.', nepali: 'आदेश', nepaliDefinition: 'कार्य वा निष्क्रियता आवश्यक पर्ने अदालतको निर्देशन। फैसला भन्दा कम औपचारिक।' },
  { term: 'Paralegal', category: 'General', definition: 'A trained legal professional who provides legal assistance under the supervision of a lawyer. Many NGOs in Nepal employ paralegals.', nepali: 'पैरालिगल', nepaliDefinition: 'वकिलको निरीक्षणमा कानुनी सहायता प्रदान गर्ने प्रशिक्षित कानुनी पेशेवर। नेपालमा धेरै गैरसरकारी संस्थाहरूले पैरालिगलहरू रोजगार गर्दछन्।' },
  { term: 'Petition', category: 'Court Procedure', definition: 'A formal written request to a court. Nepal\'s Supreme Court hears public interest litigation petitions.', nepali: 'रिट निवेदन', nepaliDefinition: 'अदालतमा दिइने औपचारिक लिखित निवेदन। नेपालको सर्वोच्च अदालतले सार्वजनिक सरोकारको रिट निवेदनहरू सुन्दछ।' },
  { term: 'Plaintiff', category: 'Court Procedure', definition: 'The person who brings a case against another in court. Also called a claimant.', nepali: 'वादी', nepaliDefinition: 'अर्को विरुद्ध अदालतमा मुद्दा दर्ता गर्ने व्यक्ति। दावीकर्ता पनि भनिन्छ।' },
  { term: 'Power of Attorney', category: 'Property Law', definition: 'A legal document authorizing someone to act on your behalf. In Nepal, this must often be notarized.', nepali: 'मुद्दती वकालतनामा', nepaliDefinition: 'कसैलाई तपाईंको तर्फबाट कार्य गर्न अधिकार दिने कानुनी कागजात। नेपालमा, यो प्रायः नोटरीकृत हुनुपर्छ।' },
  { term: 'Probate', category: 'Property Law', definition: 'The legal process of validating a will and administering a deceased person\'s estate.', nepali: 'प्रोबेट', nepaliDefinition: 'इच्छापत्र प्रमाणित गर्ने र मृतक व्यक्तिको सम्पत्तिको प्रशासन गर्ने कानुनी प्रक्रिया।' },
  { term: 'Public Interest Litigation', category: 'Constitutional Law', definition: 'A legal action filed on behalf of the public interest. Nepal\'s Supreme Court actively hears PIL cases.', nepali: 'सार्वजनिक सरोकारको मुद्दा', nepaliDefinition: 'सार्वजनिक हितको तर्फबाट दायर गरिने कानुनी कारबाही। नेपालको सर्वोच्च अदालतले सार्वजनिक सरोकारको मुद्दाहरू सक्रिय रूपमा सुन्दछ।' },
  { term: 'Rape', category: 'Criminal Law', definition: 'Non-consensual sexual intercourse. Under Nepali law, marital rape is also a criminal offense.', nepali: 'बलात्कार', nepaliDefinition: 'असहमतीपूर्ण यौन सम्पर्क। नेपाली कानून अन्तर्गत, वैवाहिक बलात्कार पनि फौजदारी अपराध हो।' },
  { term: 'Remand', category: 'Criminal Law', definition: 'Sending an accused person back to custody while investigation continues. Nepali law limits remand periods.', nepali: 'थुनुवा', nepaliDefinition: 'अनुसन्धान जारी रहँदा अभियुक्तलाई हिरासतमा फिर्ता पठाउने। नेपाली कानूनले थुनुवा अवधि सीमित गरेको छ।' },
  { term: 'Restraining Order', category: 'Family Law', definition: 'A court order protecting a person from harassment or abuse. Available under Nepal\'s Domestic Violence Act.', nepali: 'संरक्षण आदेश', nepaliDefinition: 'उत्पीडन वा दुर्व्यवहारबाट व्यक्तिलाई संरक्षण गर्ने अदालतको आदेश। नेपालको घरेलु हिंसा ऐन अन्तर्गत उपलब्ध।' },
  { term: 'Sedition', category: 'Criminal Law', definition: 'Speech or action inciting rebellion against state authority. Nepal has laws against sedition.', nepali: 'राजद्रोह', nepaliDefinition: 'राज्य अधिकार विरुद्ध विद्रोहको लागि उक्साउने भाषण वा कार्य। नेपालमा राजद्रोह विरुद्ध कानूनहरू छन्।' },
  { term: 'Sexual Harassment', category: 'Criminal Law', definition: 'Unwanted sexual advances or conduct. Nepal\'s Sexual Harassment Act prohibits this in workplaces and public spaces.', nepali: 'यौन दुर्व्यवहार', nepaliDefinition: 'अनावश्यक यौन प्रस्ताव वा व्यवहार। नेपालको यौन दुर्व्यवहार ऐनले कार्यस्थल र सार्वजनिक स्थानहरूमा यो निषेध गर्दछ।' },
  { term: 'Status Quo', category: 'General', definition: 'The existing state of affairs. Courts may order status quo to prevent changes during litigation.', nepali: 'यथास्थिति', nepaliDefinition: 'विद्यमान अवस्था। अदालतले मुद्दाको अवधिमा परिवर्तन रोक्न यथास्थितिको आदेश दिन सक्छ।' },
  { term: 'Stay Order', category: 'Court Procedure', definition: 'A temporary court order stopping an action or proceeding until a full hearing.', nepali: 'रोक लगाउने आदेश', nepaliDefinition: 'पूर्ण सुनुवाइ नहुँदासम्म कार्य वा कारबाही रोक्ने अस्थायी अदालती आदेश।' },
  { term: 'Subpoena', category: 'Court Procedure', definition: 'A legal document ordering someone to appear in court or produce evidence.', nepali: 'अदालती आदेश', nepaliDefinition: 'कसैलाई अदालतमा उपस्थित हुन वा प्रमाण पेश गर्न आदेश दिने कानुनी कागजात।' },
  { term: 'Summary Trial', category: 'Court Procedure', definition: 'A quick court proceeding for minor offenses, without a full trial. Used in some Nepali courts for efficiency.', nepali: 'सारांश सुनुवाइ', nepaliDefinition: 'साना अपराधहरूको लागि छिटो अदालती कारबाही, पूर्ण सुनुवाइ बिना। दक्षताको लागि केही नेपाली अदालतहरूमा प्रयोग गरिन्छ।' },
  { term: 'Summons', category: 'Court Procedure', definition: 'A legal notice requiring a person to appear in court.', nepali: 'सम्मन', nepaliDefinition: 'व्यक्तिलाई अदालतमा उपस्थित हुन आवश्यक पर्ने कानुनी सूचना।' },
  { term: 'Testament', category: 'Property Law', definition: 'A legal document (will) disposing of property after death. Must follow formal requirements under Nepali law.', nepali: 'इच्छापत्र', nepaliDefinition: 'मृत्युपछि सम्पत्तिको व्यवस्था गर्ने कानुनी कागजात (इच्छापत्र)। नेपाली कानून अन्तर्गत औपचारिक आवश्यकताहरू पालना गर्नुपर्छ।' },
  { term: 'Testimony', category: 'Court Procedure', definition: 'Evidence given verbally by a witness under oath in court.', nepali: 'गवाही', nepaliDefinition: 'अदालतमा शपथको तहत साक्षीद्वारा मौखिक रूपमा दिइने प्रमाण।' },
  { term: 'Tort', category: 'Civil Law', definition: 'A civil wrong causing harm or loss, leading to legal liability. Negligence and defamation are examples.', nepali: 'अपकृत्य', nepaliDefinition: 'हानि वा क्षति निम्त्याउने देवानी गल्ती, जसले कानुनी दायित्व निम्त्याउँछ। लापरवाही र मानहानि उदाहरण हुन्।' },
  { term: 'Trafficking', category: 'Criminal Law', definition: 'Illegal trade of humans for exploitation. Nepal\'s Human Trafficking Act criminalizes this severely.', nepali: 'मानव बेचबिखन', nepaliDefinition: 'शोषणको लागि मानिसको अवैध व्यापार। नेपालको मानव बेचबिखन ऐनले यसलाई कडा सजाय दिन्छ।' },
  { term: 'Trial', category: 'Court Procedure', definition: 'A formal court proceeding to determine guilt or liability. In Nepal, trials can be heard in district, appellate, or supreme courts.', nepali: 'सुनुवाइ', nepaliDefinition: 'अपराध वा दायित्व निर्धारण गर्ने औपचारिक अदालती प्रक्रिया। नेपालमा, जिल्ला, पुनरावेदन, वा सर्वोच्च अदालतमा मुद्दा सुनुवाइ हुन सक्छ।' },
  { term: 'Trust', category: 'Property Law', definition: 'A legal arrangement where one party holds property for the benefit of another.', nepali: 'ट्रस्ट', nepaliDefinition: 'जहाँ एक पक्षले अर्काको हितको लागि सम्पत्ति राख्दछ, त्यो कानुनी व्यवस्था।' },
  { term: 'Verdict', category: 'Court Procedure', definition: 'The final decision of a court after trial.', nepali: 'फैसला', nepaliDefinition: 'मुद्दाको सुनुवाइपछि अदालतको अन्तिम निर्णय।' },
  { term: 'Visa', category: 'Immigration', definition: 'Official permission to enter and stay in a country. Nepal issues various visa types for foreigners.', nepali: 'भिसा', nepaliDefinition: 'देशमा प्रवेश र बस्नको लागि आधिकारिक अनुमति। नेपालले विदेशीहरूको लागि विभिन्न प्रकारको भिसा जारी गर्दछ।' },
  { term: 'Warrant', category: 'Criminal Law', definition: 'A legal document authorizing police to arrest someone or search premises. Requires judicial approval in Nepal.', nepali: 'वारेन्ट', nepaliDefinition: 'प्रहरीलाई कसैलाई गिरफ्तार गर्न वा स्थान खोजी गर्न अधिकार दिने कानुनी कागजात। नेपालमा न्यायिक स्वीकृति आवश्यक हुन्छ।' },
  { term: 'Will', category: 'Property Law', definition: 'A legal document expressing a person\'s wishes for distribution of their property after death. Must be signed and witnessed.', nepali: 'इच्छापत्र', nepaliDefinition: 'मृत्युपछि सम्पत्ति बाँडफाँड गर्ने व्यक्तिको इच्छा अभिव्यक्त गर्ने कानुनी कागजात। हस्ताक्षर र साक्षी चाहिन्छ।' },
  { term: 'Witness', category: 'Court Procedure', definition: 'A person who sees an event or signs a document and can testify about it in court.', nepali: 'साक्षी', nepaliDefinition: 'घटना देख्ने वा कागजातमा हस्ताक्षर गर्ने र अदालतमा त्यसको बारेमा गवाही दिन सक्ने व्यक्ति।' },
  { term: 'Writ', category: 'Constitutional Law', definition: 'A formal court order requiring action or inaction. Nepal\'s Supreme Court issues writs like habeas corpus, mandamus, and certiorari.', nepali: 'रिट', nepaliDefinition: 'कार्य वा निष्क्रियता आवश्यक पर्ने औपचारिक अदालती आदेश। नेपालको सर्वोच्च अदालतले बन्दी प्रत्यक्षीकरण, परमादेश, र उत्प्रेषण जस्ता रिटहरू जारी गर्दछ।' },
  { term: 'Zoning', category: 'Property Law', definition: 'Local laws regulating land use. Nepal\'s municipalities enforce zoning regulations for construction and development.', nepali: 'जोनिङ', nepaliDefinition: 'जग्गा प्रयोग नियन्त्रण गर्ने स्थानीय कानूनहरू। नेपालका नगरपालिकाहरूले निर्माण र विकासको लागि जोनिङ नियमहरू लागू गर्दछन्।' },
];

const CATEGORIES = [...new Set(TERMS.map(t => t.category))];

const CATEGORY_LABELS = {
  'Court Procedure': 'glossary.courtProcedure',
  'Family Law': 'glossary.familyLaw',
  'Criminal Law': 'glossary.criminalLaw',
  'Property Law': 'glossary.propertyLaw',
  'Civil Law': 'glossary.civilLaw',
  'Constitutional Law': 'glossary.constitutionalLaw',
  'Intellectual Property': 'glossary.intellectualProperty',
  'Employment Law': 'glossary.employmentLaw',
  'Dispute Resolution': 'glossary.disputeResolution',
  'Immigration': 'glossary.immigration',
};

export default function LegalGlossary() {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [openTerm, setOpenTerm] = useState(null);

  const filtered = TERMS.filter(t => {
    const matchSearch = !search || t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase()) || (t.nepali && t.nepali.includes(search));
    const matchCat = category === 'all' || t.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="glossary-page">
      <div className="glossary-container">
        <div className="glossary-header">
          <BookOpen size={20} />
          <div>
            <h1>{t("glossary.title")}</h1>
            <p className="glossary-subtitle">{t("glossary.subtitle")}</p>
          </div>
        </div>

        <div className="glossary-controls">
          <div className="glossary-search">
            <Search size={16} />
            <input
              type="text"
              placeholder={t("glossary.searchPlaceholder")}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="glossary-cats">
            <button className={`glossary-cat${category === 'all' ? ' active' : ''}`} onClick={() => setCategory('all')}>{t("glossary.terms")}</button>
            {CATEGORIES.map(c => (
              <button key={c} className={`glossary-cat${category === c ? ' active' : ''}`} onClick={() => setCategory(c)}>{t(CATEGORY_LABELS[c] || c)}</button>
            ))}
          </div>
        </div>

        <div className="glossary-count">{filtered.length} {t("glossary.terms")}</div>

        <div className="glossary-list">
          {filtered.map((t, i) => (
            <div key={i} className={`glossary-term${openTerm === i ? ' open' : ''}`}>
              <button className="glossary-term-header" onClick={() => setOpenTerm(openTerm === i ? null : i)}>
                <div>
                  <strong>{lang === 'ne' && t.nepali ? t.nepali : t.term}</strong>
                  <span className={`glossary-cat-badge ${lang === 'ne' ? t.category.toLowerCase().replace(/\s+/g, '-') : ''}`}>{t.category}</span>
                </div>
                <div>
                  {t.nepali && lang !== 'ne' && <span className="glossary-nepali">{t.nepali}</span>}
                  {lang === 'ne' && <span className="glossary-nepali" style={{ opacity: 0.6, fontSize: '0.85em' }}>{t.term}</span>}
                  <ChevronDown size={14} className={`glossary-cv${openTerm === i ? ' rot' : ''}`} />
                </div>
              </button>
              <div className="glossary-term-body">
                <p>{lang === 'ne' && t.nepaliDefinition ? t.nepaliDefinition : t.definition}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
