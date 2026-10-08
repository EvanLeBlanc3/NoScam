/* NoScam data — scenarios, scam library, recovery steps.
   Sources: FTC consumer.ftc.gov, FTC OIG "4 signs", CFPB warning signs, FCC grandparent-scam guidance,
   FBI IC3 2025 Annual Report & Elder Fraud resources, Fraud.org Top Scams of 2025. */

// Question weights: positive = red flag when answered "Yes". Negative = reassuring when "Yes".
// crit:true = an automatic "this is a scam" signal if answered "Yes".
const UNIVERSAL_RULES = [
  { i: '🎭', t: 'They PRETEND', d: 'to be someone you trust — the government, your bank, a big company, or a family member. Caller ID and email names can be faked.' },
  { i: '⚠️', t: 'There\'s a PROBLEM or PRIZE', d: 'You owe money, someone\'s in trouble, your account is locked, your computer is infected — or you "won" something.' },
  { i: '⏱️', t: 'They PRESSURE you', d: 'Act now, don\'t hang up, don\'t tell anyone. Urgency is designed to stop you from thinking.' },
  { i: '💳', t: 'They want you to PAY a specific way', d: 'Gift cards, wire transfer, crypto, payment apps, cash by courier or mail. Real organizations don\'t demand these.' }
];

const SCENARIOS = [
  {
    id: 'phone-money', icon: '📞', color: '#4f8cff', cat: 'Phone',
    title: 'Someone called me asking for money',
    sub: 'An unexpected caller wants a payment',
    lib: ['gov-irs', 'ssa', 'utility', 'gift-card', 'bank-imposter'],
    q: [
      { t: 'Did the call come out of the blue — you didn\'t call them first?', w: 2, f: 'Unexpected call you didn\'t start', why: 'Most phone scams start with a call you weren\'t expecting.' },
      { t: 'Are they saying it\'s urgent, or that something bad happens if you don\'t act right now?', w: 3, f: 'Pressure to act immediately', why: 'Scammers rush you so you don\'t have time to think or check with someone.' },
      { t: 'Do they want payment by gift card, wire transfer, crypto, a payment app (Zelle, Venmo, Cash App), or cash picked up by a courier?', w: 5, crit: true, f: 'Asked to pay in a hard-to-trace way', why: 'According to the FTC, being told to pay this way is a sure sign of a scam.' },
      { t: 'Did they tell you to keep it secret, or to stay on the line while you do something?', w: 4, crit: true, f: 'Told to keep it secret / stay on the line', why: 'Secrecy keeps you from talking to someone who\'d spot the scam.' },
      { t: 'Do they claim to be from the government, police, your bank, or a well-known company?', w: 2, f: 'Claims to be an authority or known company', why: 'Pretending to be a trusted organization is the #1 scam opener. Caller ID can be faked.' },
      { t: 'Did they ask for your Social Security number, bank login, PIN, or a code sent to your phone?', w: 4, crit: true, f: 'Asked for sensitive info or a security code', why: 'Real organizations don\'t call you and ask for passwords, PINs, or one-time codes.' },
      { t: 'Did you hang up, call back using a number YOU looked up (website, bill, back of card), and they confirmed it?', w: -5, g: 'Confirmed through a number you found yourself', why: 'Calling back on a number you trust is the single best way to check.' }
    ],
    steps: ['Hang up. You never owe a stranger a polite goodbye.', 'Look up the organization\'s official number yourself and call that.', 'Never pay anyone with gift cards, wire, crypto, or cash by courier.', 'Talk it over with someone you trust before sending any money.']
  },
  {
    id: 'gift-card', icon: '🎁', color: '#ff7a59', cat: 'Payments',
    title: 'Someone wants me to buy a gift card',
    sub: 'Pay a bill, fee, or favor with gift cards',
    lib: ['gift-card', 'boss', 'tech-support', 'gov-irs'],
    q: [
      { t: 'Did someone ask you to buy gift cards to pay a bill, fine, fee, tax, or debt?', w: 5, crit: true, f: 'Gift cards requested as payment', why: 'No real business or government agency will ever tell you to pay with a gift card.' },
      { t: 'Did they ask for the numbers or PIN on the back, or a photo of the card?', w: 5, crit: true, f: 'Asked for the card numbers / PIN', why: 'Those numbers let them drain the card instantly — even while you still hold it.' },
      { t: 'Did they tell you exactly which brand of card to buy or which store to go to?', w: 3, f: 'Told which card and store to use', why: 'Scammers often name specific cards (Apple, Google Play, Target, eBay) and stores.' },
      { t: 'Are they staying on the phone with you while you shop, or want you to buy at several stores?', w: 4, crit: true, f: 'Staying on the line while you buy', why: 'They stay on the line so you can\'t talk to anyone — and split purchases so cashiers don\'t get suspicious.' },
      { t: 'Did they tell you what to say if the cashier asks questions?', w: 5, crit: true, f: 'Coached you on what to tell the cashier', why: 'Cashiers are trained to spot gift card scams. Scammers coach victims to lie.' },
      { t: 'Is the request coming by text or email from your "boss," a coworker, or a friend?', w: 3, f: 'Boss / friend asking for gift cards by message', why: 'Boss-imposter gift card scams are very common — the message is from a fake or hacked account.' },
      { t: 'Is this simply a present you\'re buying and giving in person to someone you know?', w: -6, g: 'Normal gift you\'re giving in person', why: 'Buying a gift card as a gift is totally normal!' }
    ],
    steps: ['Stop. Do not buy the card — or if you have, do not share the numbers.', 'If you already shared numbers, call the gift card company right away and keep the receipt.', 'Report it at ReportFraud.ftc.gov.']
  },
  {
    id: 'family', icon: '👵', color: '#c77dff', cat: 'Family',
    title: 'A family member says they\'re in trouble',
    sub: 'Grandkid, child, or relative needs money fast',
    lib: ['grandparent', 'friend-hacked'],
    q: [
      { t: 'Did a relative — or someone claiming to speak for them (lawyer, officer, bail bondsman) — contact you about an emergency?', w: 2, f: 'Third party speaking for a relative', why: 'Scammers often hand the phone to a fake "lawyer" or "officer" to sound official.' },
      { t: 'Do they need money right now — bail, a hospital bill, an accident, or stuck in another country?', w: 3, f: 'Urgent money for an emergency', why: 'Emergencies are used to make you panic and skip checking.' },
      { t: 'Did they ask you not to tell mom, dad, or anyone else?', w: 4, crit: true, f: '"Please don\'t tell mom and dad"', why: 'This is the classic grandparent scam line. Secrecy keeps you from verifying.' },
      { t: 'Did the voice sound a bit off — and they blamed it on crying, a cold, an injury, or a bad connection?', w: 3, f: 'Voice sounded off (possible AI voice clone)', why: 'AI can now clone a voice from a short social media clip. The FCC warns not to trust the voice alone.' },
      { t: 'Do they want gift cards, a wire, crypto, cash in an envelope, or a courier to come pick up money?', w: 5, crit: true, f: 'Cash courier / gift card / wire requested', why: 'The FBI warns of scammers sending couriers to collect cash from grandparents.' },
      { t: 'Is it from an unknown number, or did they say "I have a new number"?', w: 2, f: 'Unknown or "new" phone number', why: 'Scammers can\'t use your relative\'s real number — unless they spoof it.' },
      { t: 'When you hung up and called your relative on the number saved in your phone, did they confirm they\'re in trouble?', w: -6, g: 'Relative confirmed on their real number', why: 'Calling them directly is the fastest way to bust this scam.' },
      { t: 'Did they correctly answer your family safe word or a private question only they would know?', w: -4, g: 'Passed the family safe word test', why: 'A pre-agreed safe word is one of the best defenses against voice cloning.' }
    ],
    steps: ['Hang up and call your relative on the number already saved in your phone.', 'Can\'t reach them? Call another family member or friend who can.', 'Ask a question only the real person would know — or use a family safe word.', 'Never hand cash to a courier or "bail bondsman" who comes to your door.']
  },
  {
    id: 'government', icon: '🏛️', color: '#f4b400', cat: 'Imposter',
    title: 'Someone says they\'re the government or police',
    sub: 'IRS, Social Security, Medicare, jury duty, warrants',
    lib: ['gov-irs', 'ssa', 'jury', 'medicare', 'phantom', 'immigration', 'grant'],
    q: [
      { t: 'Do they say you owe taxes or fines, missed jury duty, have a warrant, or your Social Security number is "suspended"?', w: 4, f: 'Claims you owe money / are in legal trouble', why: 'Social Security numbers don\'t get "suspended," and courts don\'t call demanding fines for jury duty.' },
      { t: 'Are they threatening arrest, deportation, or losing your license or benefits?', w: 4, crit: true, f: 'Threatened arrest or losing benefits', why: 'Government agencies don\'t threaten you with immediate arrest over the phone.' },
      { t: 'Are they demanding payment right away by gift card, wire, crypto, Bitcoin ATM, or cash?', w: 5, crit: true, f: 'Demanding payment in an untraceable way', why: 'Government agencies never demand payment by gift card, crypto, or wire.' },
      { t: 'Did they tell you to move your money to a "safe" account to protect it?', w: 5, crit: true, f: 'Told to move money to "protect" it', why: 'The FTC says no government agency will ever tell you to transfer money to protect it.' },
      { t: 'Was the first contact a phone call, text, or social media message (not a letter in the mail)?', w: 2, f: 'First contact wasn\'t official mail', why: 'Agencies like the IRS usually contact you by mail first.' },
      { t: 'Does the caller ID show an official-looking government name or number?', w: 1, f: 'Official-looking caller ID (easily faked)', why: 'Caller ID can be "spoofed" to show any name or number — it proves nothing.' },
      { t: 'Did you get an official letter, and confirm it by calling the agency using the number on its real .gov website?', w: -5, g: 'Verified with the agency on its official .gov number', why: 'Verifying on a .gov site is the right move.' }
    ],
    steps: ['Hang up. Real agencies won\'t mind.', 'Look up the agency yourself on its official .gov website and call that number.', 'Never move money to "protect" it, and never pay the government with gift cards or crypto.', 'Report government imposters at ReportFraud.ftc.gov.']
  },
  {
    id: 'bank', icon: '🏦', color: '#00bfa6', cat: 'Imposter',
    title: 'My "bank" called or texted about fraud',
    sub: 'Suspicious activity, frozen account, "verify" request',
    lib: ['bank-imposter', 'phantom', 'p2p', 'code', 'card-fraud'],
    q: [
      { t: 'Did you get a call or text saying there\'s fraud or a problem with your account?', w: 1, f: 'Unexpected "fraud alert"', why: 'Real banks do send alerts — but scammers copy them exactly.' },
      { t: 'Are they asking for your PIN, password, full card number, or a one-time code?', w: 5, crit: true, f: 'Asked for PIN, password, or one-time code', why: 'Your bank already has your info. They will never ask for your PIN, password, or a code they sent you.' },
      { t: 'Did they tell you to send money (Zelle, wire, etc.) to "secure" it or move it to a "safe account"?', w: 5, crit: true, f: 'Told to move money to a "safe account"', why: 'Banks never ask you to send money to protect it. That money goes straight to the scammer.' },
      { t: 'Did they tell you to withdraw cash or buy gold for someone to pick up?', w: 5, crit: true, f: 'Asked to withdraw cash or buy gold for pickup', why: 'This is a growing scam targeting older adults, warned about by the FBI and FTC.' },
      { t: 'Did the text include a link to log in or "verify" your account?', w: 3, f: 'Login link in a text', why: 'Fake login pages steal your username and password.' },
      { t: 'Did they say a hacker got in, and that someone from the "government" or another company will call next?', w: 4, f: 'Hand-off to a "government" agent (Phantom Hacker)', why: 'The FBI\'s "Phantom Hacker" warning: fake tech support, fake bank, and fake government work together.' },
      { t: 'Did you hang up, call the number on the back of your card, and the bank confirmed the alert?', w: -6, g: 'Bank confirmed using the number on your card', why: 'This is exactly what you should do.' }
    ],
    steps: ['Hang up or ignore the text. Don\'t click the link.', 'Call the number on the back of your card or log in through the bank\'s official app.', 'Never share codes, PINs, or passwords — and never move money to a "safe account."']
  },
  {
    id: 'tech', icon: '💻', color: '#ff4d6d', cat: 'Tech',
    title: 'A pop-up or caller says my device has a virus',
    sub: 'Fake security warnings, "tech support," refunds',
    lib: ['tech-support', 'phantom', 'refund', 'renewal'],
    q: [
      { t: 'Did a pop-up, call, or email say your computer or phone has a virus or was hacked?', w: 3, f: 'Unexpected "virus" warning', why: 'Tech support scams cost older adults over $1 billion in 2025, per FBI IC3 data.' },
      { t: 'Did the warning tell you to call a phone number?', w: 4, crit: true, f: 'Security warning with a phone number to call', why: 'Real security warnings from Microsoft, Apple, or antivirus software never ask you to call a number.' },
      { t: 'Do they want remote access to your computer or phone?', w: 4, f: 'Wants remote access to your device', why: 'Remote access lets them see your banking, plant malware, or fake a "refund."' },
      { t: 'Are they asking you to pay for the fix — or saying they "refunded" too much and you must send the difference back?', w: 5, crit: true, f: 'Payment for a fix / "over-refund" trick', why: 'The fake over-refund trick is a classic: they edit what you see on screen.' },
      { t: 'Do they claim to be from Microsoft, Apple, Amazon, Geek Squad, or your bank?', w: 2, f: 'Claims to be a big tech company', why: 'These companies won\'t contact you out of the blue about a virus.' },
      { t: 'Did YOU reach out first, using the company\'s official website or app?', w: -4, g: 'You contacted official support yourself', why: 'Starting the contact yourself, through official channels, is much safer.' }
    ],
    steps: ['Don\'t call the number. Close the browser (force-quit or restart if it\'s stuck).', 'Never give remote access to someone who contacted you.', 'If you gave access: disconnect from the internet, run a security scan, and change passwords from a different device.']
  },
  {
    id: 'text', icon: '💬', color: '#38bdf8', cat: 'Text & Email',
    title: 'I got a text with a link',
    sub: 'Unpaid toll, package problem, account alert',
    lib: ['toll', 'package', 'wrong-number', 'phishing', 'qr'],
    q: [
      { t: 'Was the text unexpected, with a link to tap?', w: 2, f: 'Unexpected text with a link', why: 'Phishing and spoofing jumped sharply in 2025, per Fraud.org\'s Top Scams report.' },
      { t: 'Is it about an unpaid toll, a package delivery problem, a locked account, or a refund?', w: 3, f: 'Toll / package / account "problem"', why: 'The FTC has seen a big increase in fake toll texts from coast to coast.' },
      { t: 'Does it threaten fees, penalties, or suspension if you don\'t act fast?', w: 3, f: 'Threatens fees or penalties', why: 'Urgency is the scammer\'s favorite tool.' },
      { t: 'Does the link look weird — misspelled, extra words, or an unusual ending instead of the official website?', w: 4, f: 'Suspicious-looking link', why: 'Fake sites use look-alike addresses to fool you.' },
      { t: 'Does it ask for payment info, a login, or personal details?', w: 4, f: 'Asks for payment or personal info', why: 'That\'s the whole point of the fake page.' },
      { t: 'Is it from a random number, an email address, or an international number?', w: 2, f: 'Sent from a random / foreign number', why: 'Real agencies and companies usually text from short codes you recognize.' },
      { t: 'When you go to the official website or app yourself (not using the link), do you see the same issue?', w: -6, g: 'Issue confirmed on the official site / app', why: 'If it\'s real, you\'ll see it when you log in directly.' }
    ],
    steps: ['Don\'t tap the link. Don\'t reply — not even "STOP."', 'Check directly on the official website or app by typing the address yourself.', 'Forward the text to 7726 (SPAM), then delete it and block the number.']
  },
  {
    id: 'email', icon: '📧', color: '#7c83ff', cat: 'Text & Email',
    title: 'An email says there\'s a problem or a charge',
    sub: 'Account locked, invoice, subscription renewal',
    lib: ['phishing', 'renewal', 'refund', 'bec'],
    q: [
      { t: 'Does it say your account is locked, a payment failed, or there\'s suspicious activity?', w: 2, f: 'Account "problem" email', why: 'This is the most common phishing hook.' },
      { t: 'Is it an invoice or renewal for something you don\'t remember buying (antivirus, Geek Squad, PayPal, Amazon)?', w: 4, f: 'Invoice for something you didn\'t buy', why: 'Fake renewal invoices try to get you to call a "cancel" number.' },
      { t: 'Does it push you to call a number or click a link to cancel, dispute, or fix it?', w: 4, f: 'Pushes you to call or click', why: 'The phone number connects to the scammer, not the real company.' },
      { t: 'Does the sender\'s address look off — misspelled, a free email like @gmail, or a strange domain?', w: 4, f: 'Odd sender address', why: 'Real companies email from their own domain.' },
      { t: 'Does it have a generic greeting ("Dear Customer") or spelling and grammar mistakes?', w: 2, f: 'Generic greeting or sloppy writing', why: 'Companies you do business with usually know your name — though AI is making scams more polished.' },
      { t: 'Does it ask you to log in, open an attachment, or share personal info?', w: 3, f: 'Asks you to log in or open an attachment', why: 'Attachments can carry malware; links can lead to fake login pages.' },
      { t: 'When you log in to your account directly (typing the address yourself), is the same problem there?', w: -6, g: 'Problem confirmed by logging in directly', why: 'That\'s the safe way to check.' }
    ],
    steps: ['Don\'t click links, open attachments, or call numbers in the email.', 'Log in directly by typing the website address or using the official app.', 'Report it as phishing in your email app, then delete it.']
  },
  {
    id: 'romance', icon: '💘', color: '#ff5fa2', cat: 'Online',
    title: 'Someone I met online needs money',
    sub: 'Dating app, social media, or a "wrong number" friend',
    lib: ['romance', 'pig-butcher', 'wrong-number', 'sextortion'],
    q: [
      { t: 'Have you only met online — dating app, social media, a game, or a "wrong number" text?', w: 2, f: 'Relationship exists only online', why: 'Romance scammers build trust for weeks or months before asking for money.' },
      { t: 'Have they avoided meeting in person or doing a live video call, always with an excuse?', w: 4, f: 'Always avoids meeting or video calls', why: 'Excuses keep the fake identity safe. Note: AI can now fake video too.' },
      { t: 'Did things get romantic or "you\'re my soulmate" very fast?', w: 2, f: 'Moved fast emotionally', why: 'Love-bombing builds attachment quickly.' },
      { t: 'Are they asking for money — medical bills, travel, customs fees, or an emergency?', w: 5, crit: true, f: 'Online sweetheart asking for money', why: 'Someone you\'ve never met asking for money is the core of every romance scam.' },
      { t: 'Have they brought up investing or crypto, offering to teach you or show you their profits?', w: 5, crit: true, f: 'Pushing crypto or investing', why: 'This is "pig butchering" — romance plus fake investment. Investment scams cause the biggest losses of all.' },
      { t: 'Do they say they\'re overseas — military, oil rig, doctor abroad, or international business?', w: 3, f: 'Conveniently far away', why: 'Being "abroad" explains why they can\'t meet and why they need money.' },
      { t: 'Did a reverse image search of their photos show a different name or person?', w: 5, crit: true, f: 'Photos belong to someone else', why: 'Scammers steal photos from real people\'s profiles.' },
      { t: 'Have you met in person, and have friends or family met them too?', w: -5, g: 'Met in person with friends/family', why: 'Real-world meetings are a strong sign it\'s genuine.' }
    ],
    steps: ['Don\'t send money, gifts, crypto, or gift cards to someone you haven\'t met in person.', 'Talk to a friend or family member — scammers want you isolated.', 'Do a reverse image search on their photos.', 'Report the profile to the app or site and at ReportFraud.ftc.gov.']
  },
  {
    id: 'invest', icon: '📈', color: '#22c55e', cat: 'Investing',
    title: 'Someone offered me an investment or crypto deal',
    sub: 'Guaranteed returns, trading apps, celebrity ads',
    lib: ['pig-butcher', 'investment', 'celebrity', 'recovery'],
    q: [
      { t: 'Are they guaranteeing big returns with little or no risk?', w: 5, crit: true, f: 'Guaranteed high returns', why: 'Every real investment has risk. "Guaranteed" profits are a hallmark of fraud.' },
      { t: 'Did you meet this person through social media, a dating app, a group chat, or a random text?', w: 3, f: 'Met through social media or random message', why: 'Most crypto investment scams start with a stranger online.' },
      { t: 'Do they want you to use a specific app, website, or crypto platform you\'ve never heard of?', w: 4, f: 'Unfamiliar trading platform', why: 'Fake platforms show made-up profits on screen.' },
      { t: 'Can you see "profits" growing, but have to pay fees or taxes before you can withdraw?', w: 5, crit: true, f: 'Must pay to withdraw your own money', why: 'That\'s the trap: the balance is fake and the fees are real.' },
      { t: 'Is there pressure to invest quickly before the opportunity "closes"?', w: 3, f: 'Pressure to invest fast', why: 'Legit investments don\'t vanish in an hour.' },
      { t: 'Is a celebrity or famous investor "endorsing" it in an ad or video?', w: 4, f: 'Celebrity endorsement (could be a deepfake)', why: 'AI deepfake videos of celebrities are widely used to push scam investments.' },
      { t: 'Did you confirm the person and firm are registered on FINRA BrokerCheck or Investor.gov?', w: -3, g: 'Verified on BrokerCheck / Investor.gov', why: 'Registration doesn\'t guarantee a good deal, but unregistered sellers are a big red flag.' }
    ],
    steps: ['Don\'t invest based on a tip from someone you met online.', 'Look up the person and firm on FINRA BrokerCheck and Investor.gov.', 'Never pay "fees" or "taxes" to withdraw money — it won\'t come back.', 'Report crypto scams at ic3.gov.']
  },
  {
    id: 'buying', icon: '🛒', color: '#fb923c', cat: 'Shopping',
    title: 'I\'m buying something online',
    sub: 'Websites, Marketplace, tickets, pets, cars',
    lib: ['shopping', 'marketplace', 'tickets', 'pet', 'car'],
    q: [
      { t: 'Is the price way lower than anywhere else?', w: 3, f: 'Price too good to be true', why: 'Online merchandise scams were the #2 most-reported scam in 2025, per Fraud.org.' },
      { t: 'Is the website new or unfamiliar, or did you find it through a social media ad?', w: 3, f: 'Unknown site or social media ad', why: 'Fake stores advertise heavily on social media and disappear quickly.' },
      { t: 'Does the seller only accept Zelle, wire, crypto, gift cards, or payment app "friends & family"?', w: 5, crit: true, f: 'Only accepts unprotected payment methods', why: 'These methods have no buyer protection — once sent, it\'s gone.' },
      { t: 'Is the seller pressuring you ("lots of people interested — pay now to hold it")?', w: 2, f: 'Pressure to pay fast', why: 'Urgency stops you from researching.' },
      { t: 'Are you buying a pet, event tickets, or a vehicle you can\'t see in person?', w: 3, f: 'Can\'t see the pet / tickets / vehicle', why: 'These are favorite categories for fake sellers.' },
      { t: 'Few or fake-looking reviews, no physical address, or no real contact info?', w: 3, f: 'No reviews or real contact info', why: 'Search the site name plus "scam" or "reviews" before buying.' },
      { t: 'Can you pay with a credit card or a platform\'s buyer-protected checkout?', w: -3, g: 'Paying with buyer protection', why: 'Credit cards let you dispute charges.' },
      { t: 'Can you see or pick up the item in person before paying?', w: -3, g: 'Can inspect in person first', why: 'Seeing it first protects you.' }
    ],
    steps: ['Pay by credit card or buyer-protected checkout only.', 'Search the store or seller name with "scam" or "reviews."', 'Never pay with gift cards, wire, crypto, or "friends & family."']
  },
  {
    id: 'selling', icon: '💸', color: '#facc15', cat: 'Shopping',
    title: 'I\'m selling something — or got paid by mistake',
    sub: 'Overpayment, fake checks, Zelle "upgrade," codes',
    lib: ['overpay', 'p2p', 'code', 'marketplace'],
    q: [
      { t: 'Did the buyer send more than your asking price and ask you to refund the difference?', w: 5, crit: true, f: 'Overpaid and wants the difference back', why: 'The original payment will bounce — and you\'ll be out the "refund."' },
      { t: 'Are they paying by check or money order and want you to ship or send money before it fully clears?', w: 4, f: 'Check that hasn\'t truly cleared', why: 'Fake checks can take weeks to bounce, even after funds "appear."' },
      { t: 'Do they want to send their own "shipper," or ask you to pay a fee to receive their payment?', w: 4, f: 'Fee to receive payment / their own shipper', why: 'You should never pay to get paid.' },
      { t: 'Did they ask for a code sent to your phone "to verify you\'re real"?', w: 5, crit: true, f: 'Asked for a verification code', why: 'That code lets them open accounts (like Google Voice) in your name or take over yours.' },
      { t: 'Did you get an "email from Zelle/PayPal/Venmo" saying you must upgrade to a business account to receive money?', w: 5, crit: true, f: 'Fake "upgrade your account" email', why: 'Payment apps don\'t email you to pay for upgrades to receive money.' },
      { t: 'Did someone "accidentally" send you money on a payment app and ask you to send it back?', w: 4, f: '"Accidental" payment to return', why: 'The original may be from a stolen card. Contact the app instead of sending money yourself.' },
      { t: 'Is the buyer local and paying cash in person at a safe public spot?', w: -4, g: 'Local cash sale in a safe place', why: 'In-person cash deals avoid most selling scams.' }
    ],
    steps: ['Never refund an overpayment. Never pay to get paid.', 'Never share verification codes with anyone.', 'For "accidental" payments, contact the payment app — don\'t send money back yourself.']
  },
  {
    id: 'prize', icon: '🏆', color: '#eab308', cat: 'Prizes',
    title: 'They say I won a prize or lottery',
    sub: 'Sweepstakes, lottery, free vacation, car',
    lib: ['lottery', 'grant'],
    q: [
      { t: 'Were you told you won a lottery, sweepstakes, or prize you don\'t remember entering?', w: 4, f: 'Won something you never entered', why: 'You can\'t win a contest you didn\'t enter.' },
      { t: 'Do you have to pay fees, taxes, or shipping to collect your prize?', w: 5, crit: true, f: 'Must pay to collect a prize', why: 'Legit sweepstakes never make you pay to collect. That\'s a scam every time.' },
      { t: 'Is it a foreign lottery?', w: 4, f: 'Foreign lottery', why: 'It\'s illegal to play foreign lotteries by mail or phone in the U.S.' },
      { t: 'Are they asking for your bank details to "deposit" your winnings?', w: 4, f: 'Asking for bank info', why: 'They\'ll withdraw, not deposit.' },
      { t: 'Are you told to act fast or keep the win secret?', w: 3, f: 'Act fast / keep it secret', why: 'Pressure and secrecy are classic scam moves.' },
      { t: 'Did you really enter this contest, and confirm with the official company using contact info you found yourself?', w: -4, g: 'Confirmed with the real company', why: 'Good — that\'s how you check.' }
    ],
    steps: ['Never pay to collect a prize.', 'Don\'t share bank info to receive winnings.', 'Look up the company yourself and confirm directly.']
  },
  {
    id: 'job', icon: '💼', color: '#14b8a6', cat: 'Jobs',
    title: 'I got a job offer that seems too good',
    sub: 'Remote work, "tasks," reshipping, mystery shopper',
    lib: ['job', 'task', 'mule', 'overpay'],
    q: [
      { t: 'Did they offer you the job without a real interview (or only a chat-app "interview")?', w: 4, f: 'Hired without a real interview', why: 'Real employers interview you. Instant offers are a red flag.' },
      { t: 'Do you have to pay for training, equipment, or a starter kit?', w: 5, crit: true, f: 'Must pay to start the job', why: 'Legit employers don\'t charge you to work for them.' },
      { t: 'Are they sending you a check to buy equipment and send back the rest?', w: 5, crit: true, f: 'Check to deposit and send money back', why: 'The check is fake. You\'ll owe the bank.' },
      { t: 'Is the job "liking" videos, rating products, or completing "tasks" — and you have to deposit money to unlock earnings?', w: 5, crit: true, f: '"Task" job that needs your deposit', why: 'Task scams surged recently — you\'re paying them, not the other way around.' },
      { t: 'Are you asked to receive and reship packages, or move money through your account?', w: 5, crit: true, f: 'Reshipping / moving money', why: 'You could become a "money mule" and face legal trouble.' },
      { t: 'Is the pay unusually high for easy work?', w: 3, f: 'Pay too high for easy work', why: 'Too good to be true usually is.' },
      { t: 'Does the recruiter only use a personal email, WhatsApp, Telegram, or text?', w: 3, f: 'Recruiter avoids company channels', why: 'Real recruiters usually use a company email address.' },
      { t: 'Did you find this job on the company\'s official careers website?', w: -4, g: 'Job listed on the official careers site', why: 'Verifying directly with the company helps a lot.' }
    ],
    steps: ['Never pay to get a job.', 'Never deposit a check and send money back.', 'Look up the company yourself and confirm the job on their official site.']
  },
  {
    id: 'rental', icon: '🏠', color: '#a78bfa', cat: 'Home',
    title: 'I\'m looking at a rental listing',
    sub: 'Apartment or house that seems perfect',
    lib: ['rental', 'timeshare'],
    q: [
      { t: 'Is the rent much lower than similar places nearby?', w: 3, f: 'Rent suspiciously low', why: 'Bargain prices lure people in fast.' },
      { t: 'Is the "landlord" out of town and unable to show you the property?', w: 4, f: 'Landlord can\'t show it in person', why: 'Scammers copy real listings they don\'t own.' },
      { t: 'Do they want a deposit or first month\'s rent before you see it or sign a lease?', w: 4, f: 'Money before a tour or lease', why: 'Never pay before you\'ve seen the place and have a lease.' },
      { t: 'Do they want payment by wire, Zelle, gift card, or crypto?', w: 5, crit: true, f: 'Rent by untraceable payment', why: 'No recourse if it\'s fake.' },
      { t: 'Does the same listing appear elsewhere with a different price or contact?', w: 4, f: 'Duplicate listing, different contact', why: 'Search the address — copied listings are a giveaway.' },
      { t: 'Have you toured the inside in person and confirmed the owner through county property records?', w: -5, g: 'Toured & verified ownership', why: 'That\'s the gold standard for rentals.' }
    ],
    steps: ['See the inside in person (or have someone you trust do it).', 'Search the address online for duplicate listings.', 'Never wire money or pay a deposit before signing a lease.']
  },
  {
    id: 'code', icon: '🔢', color: '#f43f5e', cat: 'Identity',
    title: 'Someone wants a code sent to my phone',
    sub: 'Verification / one-time passcode requests',
    lib: ['code', 'sim', 'account-takeover'],
    q: [
      { t: 'Did someone ask you to read back or forward a code that was texted or emailed to you?', w: 6, crit: true, f: 'Asked you to share a one-time code', why: 'Those codes are the keys to your accounts. Nobody legit will ever ask for one.' },
      { t: 'Is the person a stranger from a listing, someone claiming to be your bank, or a "friend" messaging you?', w: 3, f: 'Request from stranger, "bank," or "friend"', why: 'All three are common versions of this scam.' },
      { t: 'Did you get a code you didn\'t request?', w: 3, f: 'Code you didn\'t request', why: 'Someone may be trying to log into your account right now.' },
      { t: 'Did they say it\'s to "verify you\'re a real person"?', w: 5, crit: true, f: '"Prove you\'re real" code request', why: 'This is the Google Voice / account takeover scam.' },
      { t: 'Are you the one logging in to your own account right now, on your own?', w: -3, g: 'You\'re logging in yourself', why: 'Fine to use the code yourself — still never share it.' }
    ],
    steps: ['Never share a verification code. Ever. With anyone.', 'If you got a code you didn\'t request, change that account\'s password.', 'Turn on two-step verification with an authenticator app where you can.']
  },
  {
    id: 'boss', icon: '👔', color: '#64748b', cat: 'Work',
    title: 'My boss or a vendor asked for gift cards or a payment',
    sub: 'Urgent request, changed bank details, wire',
    lib: ['boss', 'bec'],
    q: [
      { t: 'Is your boss or an executive asking for gift cards, a wire, or a quick payment?', w: 4, f: 'Exec asking for gift cards / wire', why: 'The FTC warns: that\'s not your boss asking for gift cards.' },
      { t: 'Is it from a personal email, an unknown phone number, or an address that\'s slightly off?', w: 4, f: 'Unfamiliar or look-alike sender', why: 'Look-alike addresses swap one letter or use a personal email.' },
      { t: 'Do they say it\'s urgent and they\'re "in a meeting, can\'t talk"?', w: 4, f: '"Urgent — can\'t talk right now"', why: 'Avoiding a call keeps you from verifying.' },
      { t: 'Are they asking you to keep it confidential or skip normal approvals?', w: 5, crit: true, f: 'Keep it quiet / skip approvals', why: 'Bypassing policy is a top red flag in business email compromise.' },
      { t: 'Is a vendor saying their bank account details changed and future payments should go elsewhere?', w: 4, f: 'Vendor "changed bank account"', why: 'Fake invoice/bank-change requests cost businesses hundreds of millions.' },
      { t: 'Did you confirm by calling them at a number you already had (not one in the message)?', w: -6, g: 'Confirmed by calling a known number', why: 'A quick call stops almost every one of these.' }
    ],
    steps: ['Call the person on a number you already have — not one in the message.', 'Follow normal approval steps, no matter how urgent it sounds.', 'Report the message to your IT/security team (e.g., the Report Phish button in Outlook).']
  },
  {
    id: 'friend', icon: '🙋', color: '#06b6d4', cat: 'Online',
    title: 'A friend messaged me on social media asking for help',
    sub: 'Money, a code, voting link, or "investment win"',
    lib: ['friend-hacked', 'code', 'celebrity'],
    q: [
      { t: 'Did the message come out of the blue from a friend\'s social media account?', w: 2, f: 'Unexpected DM from a friend', why: 'Hacked accounts message everyone on the friends list.' },
      { t: 'Are they asking for money, a code sent to your phone, or to "vote" for them via a link?', w: 4, f: 'Asking for money, codes, or link clicks', why: 'These are how hackers spread to the next account.' },
      { t: 'Does their writing style seem off — not how they usually talk?', w: 3, f: 'Doesn\'t sound like them', why: 'Trust your gut on tone.' },
      { t: 'Do they say they can\'t talk on the phone right now?', w: 4, f: 'Can\'t talk on the phone', why: 'A real friend can usually do a 10-second call.' },
      { t: 'Are they suddenly selling things or bragging about crypto/investment winnings?', w: 3, f: 'Selling stuff / bragging about crypto', why: 'Hacked accounts are often used to push scams to friends.' },
      { t: 'Did you call them on their known phone number and they confirmed it\'s really them?', w: -6, g: 'Friend confirmed by phone', why: 'Perfect — that\'s the way.' }
    ],
    steps: ['Call your friend on their known number before doing anything.', 'Never share codes or click "vote for me" links.', 'Let them know their account may be hacked.']
  },
  {
    id: 'utility', icon: '💡', color: '#fbbf24', cat: 'Home',
    title: 'The power or water company says they\'ll shut me off',
    sub: 'Disconnection threats, door-to-door collectors',
    lib: ['utility'],
    q: [
      { t: 'Are they threatening to shut off your power, water, or gas today?', w: 4, f: 'Same-day shutoff threat', why: 'Utilities normally send written notices well before disconnecting.' },
      { t: 'Do they want payment by gift card, payment app, crypto, or a Bitcoin ATM?', w: 5, crit: true, f: 'Utility payment by gift card / crypto', why: 'Real utilities don\'t take gift cards or Bitcoin ATMs.' },
      { t: 'Is someone at your door claiming to be from the utility and asking for payment?', w: 3, f: 'Door-to-door "utility" collector', why: 'Ask for ID and call the utility to confirm — or don\'t open the door.' },
      { t: 'Are they offering a "refund" or "discount" if you pay right now?', w: 3, f: 'Refund / discount if you pay now', why: 'Another common hook.' },
      { t: 'Did you check your account by calling the number printed on your bill?', w: -5, g: 'Checked using the number on your bill', why: 'That\'s exactly right.' }
    ],
    steps: ['Hang up and call the number on your bill.', 'Never pay a utility with gift cards or crypto.', 'Ask door-to-door visitors to leave; call the utility to confirm.']
  },
  {
    id: 'debt', icon: '📉', color: '#94a3b8', cat: 'Money',
    title: 'Someone offered to fix my debt or student loans',
    sub: 'Debt relief, credit repair, loan forgiveness',
    lib: ['debt', 'student-loan', 'grant'],
    q: [
      { t: 'Do you have to pay an upfront fee before they do anything?', w: 5, crit: true, f: 'Upfront fee for debt help', why: 'It\'s illegal for debt relief companies selling by phone to charge before settling your debt.' },
      { t: 'Do they promise to erase your debt or guarantee loan forgiveness?', w: 4, f: 'Guaranteed debt erasure / forgiveness', why: 'No one can guarantee that.' },
      { t: 'Are they asking for your FSA ID, account login, or password?', w: 5, crit: true, f: 'Asked for your FSA ID / login', why: 'With your login, they can change your contact info and divert your account.' },
      { t: 'Are they telling you to stop paying your lender and only talk to them?', w: 4, f: 'Told to stop paying your lender', why: 'This can wreck your credit and add fees.' },
      { t: 'Did the offer come as an unexpected call, text, or ad?', w: 2, f: 'Unsolicited offer', why: 'Most of these come uninvited.' },
      { t: 'Are you working directly with your loan servicer, StudentAid.gov, or a nonprofit credit counselor?', w: -4, g: 'Working with official / nonprofit help', why: 'Applying for federal student aid programs is free.' }
    ],
    steps: ['Never pay upfront for debt help.', 'Contact your loan servicer or StudentAid.gov directly — it\'s free.', 'Never share your FSA ID or logins.']
  },
  {
    id: 'charity', icon: '🤝', color: '#4ade80', cat: 'Money',
    title: 'A charity is asking me to donate',
    sub: 'Disaster relief, police/veteran groups, causes',
    lib: ['charity'],
    q: [
      { t: 'Are they pressuring you to donate right now?', w: 3, f: 'Pressure to give immediately', why: 'Real charities will happily take your donation tomorrow.' },
      { t: 'Do they want cash, a gift card, a wire, or crypto?', w: 5, crit: true, f: 'Donation by cash / gift card / crypto', why: 'Safer to give by credit card or check to a verified charity.' },
      { t: 'Does the name sound like a famous charity, but slightly different?', w: 3, f: 'Look-alike charity name', why: 'Copycat names are common after disasters.' },
      { t: 'Are they thanking you for a donation you don\'t remember making?', w: 3, f: '"Thanks for your past gift" you didn\'t give', why: 'A trick to make you think you\'ve given before.' },
      { t: 'Are they vague about how the money is actually used?', w: 2, f: 'Vague about how money is used', why: 'Legit charities can tell you specifics.' },
      { t: 'Did you check them on Charity Navigator, BBB Wise Giving Alliance, or the IRS Tax Exempt Organization Search?', w: -4, g: 'Charity verified', why: 'Good research!' }
    ],
    steps: ['Look up the charity yourself before giving.', 'Give by credit card or check — never cash, gift cards, or crypto.', 'Donate through the charity\'s official website.']
  },
  {
    id: 'contractor', icon: '🔨', color: '#d97706', cat: 'Home',
    title: 'A contractor showed up offering work',
    sub: 'Roof, driveway, storm repair, "leftover materials"',
    lib: ['contractor'],
    q: [
      { t: 'Did they show up uninvited saying they noticed a problem or have leftover materials?', w: 4, f: 'Uninvited door-knocker', why: 'Classic home-repair scam opener, especially after storms.' },
      { t: 'Do they want full or large payment upfront, in cash?', w: 4, f: 'Big upfront cash payment', why: 'They may never come back.' },
      { t: 'Is there no written contract, license, or proof of insurance?', w: 4, f: 'No contract, license, or insurance', why: 'Always get it in writing.' },
      { t: 'Is there pressure to decide today ("special price only today")?', w: 3, f: 'Today-only pressure', why: 'Good contractors don\'t need to rush you.' },
      { t: 'Once on your roof or in your attic, did they suddenly "find" major problems?', w: 2, f: 'Surprise "major problems"', why: 'Some create or exaggerate damage.' },
      { t: 'Did you check their license, get multiple quotes, and have a written contract?', w: -5, g: 'License checked, quotes, written contract', why: 'Exactly right.' }
    ],
    steps: ['Get at least three written quotes.', 'Check licensing with your state or city.', 'Never pay in full upfront or in cash.']
  },
  {
    id: 'threat', icon: '🛡️', color: '#ef4444', cat: 'Online',
    title: 'Someone is threatening to share private photos',
    sub: 'Sextortion or "I hacked your webcam" emails',
    lib: ['sextortion'],
    q: [
      { t: 'Is someone threatening to share private photos or videos unless you pay?', w: 6, crit: true, f: 'Blackmail / sextortion threat', why: 'Paying usually leads to more demands, not deletion. You are not alone and it\'s not your fault.' },
      { t: 'Did an email claim they hacked your webcam — maybe showing an old password of yours?', w: 5, crit: true, f: '"I hacked your webcam" email', why: 'Old passwords come from public data breaches. These emails are mass-sent bluffs.' },
      { t: 'Are they demanding crypto or gift cards with a deadline?', w: 4, f: 'Crypto / gift card deadline', why: 'Deadlines are pressure tactics.' }
    ],
    steps: ['Don\'t pay and stop responding. Don\'t delete the messages — save screenshots.', 'Block the account and report it to the platform and at ic3.gov.', 'If a minor is involved, use NCMEC\'s CyberTipline and "Take It Down" (takeitdown.ncmec.org).', 'Change any password they mentioned and turn on two-step verification.', 'Talk to someone you trust. This is a crime against you.']
  },
  {
    id: 'other', icon: '🤔', color: '#8b5cf6', cat: 'General',
    title: 'Something else feels off',
    sub: 'Run the universal scam check',
    lib: ['phishing', 'gift-card', 'gov-irs'],
    q: [
      { t: 'Did they contact you unexpectedly?', w: 2, f: 'Unexpected contact', why: 'Most scams start with contact you didn\'t ask for.' },
      { t: 'Are they pretending to be someone you know or trust — a company, agency, or family member?', w: 3, f: 'Pretending to be someone trusted', why: 'Sign #1 of a scam, per the FTC.' },
      { t: 'Do they say there\'s a problem — or that you won a prize?', w: 3, f: 'A "problem" or "prize"', why: 'Sign #2 of a scam.' },
      { t: 'Are they pressuring you to act immediately?', w: 4, f: 'Pressure to act now', why: 'Sign #3 of a scam.' },
      { t: 'Do they want payment by gift card, wire, crypto, payment app, or cash courier?', w: 5, crit: true, f: 'Specific, untraceable payment method', why: 'Sign #4 — and the biggest giveaway.' },
      { t: 'Did they ask for personal info, passwords, account numbers, or codes?', w: 4, f: 'Asked for personal info or codes', why: 'Real organizations don\'t need these from an unexpected call.' },
      { t: 'Did they tell you to keep it secret?', w: 4, crit: true, f: 'Told to keep it secret', why: 'Secrecy isolates you from help.' },
      { t: 'Does it sound too good to be true?', w: 3, f: 'Too good to be true', why: 'It usually is.' },
      { t: 'Did you verify it independently, using contact info you found yourself?', w: -5, g: 'Verified independently', why: 'Independent checking is your superpower.' }
    ],
    steps: ['Pause. Don\'t pay or share anything yet.', 'Verify using contact info you look up yourself.', 'Talk to someone you trust.']
  }
];

/* ===== The Top 50 Scam Library ===== */
const LIBRARY = [
  { id: 'grandparent', n: 'Grandparent / Family Emergency', c: 'Imposter', how: 'A "grandchild" or relative calls in a panic — arrested, in an accident, or stranded — and needs money fast. Often uses an AI-cloned voice and a fake lawyer or officer.', s: ['"Don\'t tell mom and dad"', 'Voice sounds slightly off', 'Cash by courier, gift cards, or wire'], a: ['Hang up and call the relative on their saved number', 'Use a family safe word', 'Check with other family members'] },
  { id: 'gov-irs', n: 'IRS / Tax Imposter', c: 'Imposter', how: 'Caller says you owe back taxes and will be arrested unless you pay now.', s: ['Threat of arrest', 'Demand for gift cards, wire, or crypto', 'No prior letter by mail'], a: ['The IRS usually contacts you by mail first', 'Check your account at IRS.gov', 'Hang up'] },
  { id: 'ssa', n: 'Social Security Imposter', c: 'Imposter', how: 'Caller claims your Social Security number is "suspended" or linked to a crime.', s: ['"Your SSN is suspended"', 'Threats to your benefits', 'Asks to confirm your SSN'], a: ['SSNs don\'t get suspended', 'Call SSA at the number on SSA.gov', 'Never give your SSN to a caller'] },
  { id: 'medicare', n: 'Medicare / Health Insurance', c: 'Imposter', how: 'Someone offers a "new card," free equipment, or genetic tests in exchange for your Medicare number.', s: ['Asks for your Medicare number', 'Free medical gear or tests', 'Unsolicited call'], a: ['Medicare won\'t call to ask for your number', 'Call 1-800-MEDICARE', 'Review your statements'] },
  { id: 'jury', n: 'Jury Duty / Arrest Warrant', c: 'Imposter', how: 'A "deputy" says you missed jury duty and must pay a fine now — sometimes followed by official-looking documents.', s: ['Warrant threat', 'Pay a fine by phone', 'Fake court documents by text/email'], a: ['Courts don\'t demand fines by phone', 'Call the court clerk directly', 'Ignore and report'] },
  { id: 'phantom', n: 'Phantom Hacker', c: 'Imposter', how: 'Fake tech support, then a fake bank, then a fake government agent convince you to move your savings to a "safe" account.', s: ['Multiple "officials" in sequence', 'Move money to protect it', 'Remote access requested'], a: ['No agency will tell you to move money', 'Call your bank yourself', 'Talk to family first'] },
  { id: 'bank-imposter', n: 'Bank Fraud Dept. Imposter', c: 'Imposter', how: 'A text or call "from your bank" asks you to confirm a charge, then asks for codes or to send money.', s: ['Asks for a one-time code or PIN', 'Send money via Zelle to "reverse" fraud', 'Spoofed bank caller ID'], a: ['Call the number on the back of your card', 'Never share codes', 'Banks never ask you to move money to protect it'] },
  { id: 'utility', n: 'Utility Shutoff', c: 'Imposter', how: 'Threatens to cut power/water today unless you pay immediately.', s: ['Same-day shutoff threat', 'Gift card or Bitcoin ATM payment', 'Door-to-door collector'], a: ['Call the number on your bill', 'Never pay with gift cards'] },
  { id: 'immigration', n: 'Immigration Services', c: 'Imposter', how: 'Fake officials or "notarios" threaten deportation or charge for forms that are free or that they can\'t legally handle.', s: ['Deportation threats', 'Guaranteed green cards', 'Fees for free forms'], a: ['Use USCIS.gov', 'Work with licensed attorneys or accredited representatives'] },
  { id: 'grant', n: 'Fake Government Grant', c: 'Imposter', how: '"You qualify for a free government grant — just pay a processing fee."', s: ['Unsolicited grant offer', 'Upfront fee', 'Asks for bank info'], a: ['The government doesn\'t call offering grants', 'Look up real programs on .gov sites'] },
  { id: 'tech-support', n: 'Tech Support Pop-Up', c: 'Tech', how: 'A scary pop-up or call claims your device is infected and gives a number to call for help.', s: ['Pop-up with a phone number', 'Remote access request', 'Payment for a "fix"'], a: ['Close the browser or restart', 'Never call pop-up numbers', 'Contact the company through its official site'] },
  { id: 'refund', n: 'Fake Refund / Over-Refund', c: 'Tech', how: '"You were overcharged — we\'ll refund you." Then they "accidentally" refund too much and demand the difference back.', s: ['Remote access to "process refund"', 'Panic over an over-refund', 'Send the difference by gift card or wire'], a: ['Hang up', 'Check your real account balance yourself'] },
  { id: 'renewal', n: 'Fake Subscription Renewal', c: 'Text & Email', how: 'An "invoice" says your antivirus or Geek Squad plan renewed for hundreds of dollars. Call to cancel!', s: ['Invoice for something you didn\'t buy', 'Phone number to cancel', 'Generic sender'], a: ['Don\'t call the number', 'Check your card statement or the real account'] },
  { id: 'phishing', n: 'Phishing Email', c: 'Text & Email', how: 'Emails pretending to be a known company try to get you to log in on a fake page or open an infected attachment.', s: ['Urgent account warning', 'Look-alike sender address', 'Links that don\'t match the real site'], a: ['Type the website address yourself', 'Report as phishing', 'Use multi-factor authentication'] },
  { id: 'toll', n: 'Unpaid Toll Text', c: 'Text & Email', how: 'A text claims you owe a small unpaid toll and links to a fake payment page.', s: ['Small "unpaid toll" balance', 'Late-fee threat', 'Strange link'], a: ['Check your account on the official toll site/app', 'Forward to 7726', 'Delete'] },
  { id: 'package', n: 'Package Delivery Text', c: 'Text & Email', how: '"Your package couldn\'t be delivered — update your address." The link steals your info.', s: ['Package you didn\'t expect', 'Small redelivery fee', 'Link to a look-alike site'], a: ['Track using the retailer\'s official app', 'Don\'t tap links'] },
  { id: 'wrong-number', n: '"Wrong Number" Text', c: 'Text & Email', how: 'A friendly "oops, wrong number" turns into a friendship, then romance or crypto investing.', s: ['Friendly stranger who keeps chatting', 'Moves to WhatsApp/Telegram', 'Eventually talks crypto'], a: ['Don\'t engage with wrong-number texts', 'Block and delete'] },
  { id: 'qr', n: 'QR Code Scam', c: 'Text & Email', how: 'Fake QR stickers on parking meters or in messages send you to fake payment sites.', s: ['Sticker over a real QR code', 'QR code in an unexpected message'], a: ['Use the official parking app', 'Type addresses yourself'] },
  { id: 'gift-card', n: 'Gift Card Payment Scam', c: 'Payments', how: 'Any story that ends with "buy gift cards and read me the numbers."', s: ['Specific brand and store', 'Read the numbers / PIN', 'Stay on the line while you buy'], a: ['Only scammers demand gift card payments', 'Contact the card company if you paid; keep receipts'] },
  { id: 'p2p', n: 'Payment App (Zelle/Venmo/Cash App)', c: 'Payments', how: 'Fake "accidental payments," fake "upgrade" emails, or scammers posing as the bank asking you to "send to yourself."', s: ['Return an accidental payment', 'Upgrade to receive money', 'Send money to "reverse" fraud'], a: ['Only pay people you know', 'Contact the app for mistaken payments'] },
  { id: 'overpay', n: 'Overpayment / Fake Check', c: 'Payments', how: 'Someone sends a check for too much and asks you to send back the difference. The check bounces later.', s: ['Overpayment', 'Send back the difference', 'Urgency before check clears'], a: ['Never refund overpayments', 'Wait for the bank to confirm the check truly cleared'] },
  { id: 'card-fraud', n: 'Credit Card Skimming & Fraud Calls', c: 'Payments', how: 'Card skimmers on gas pumps/ATMs or fake "card security" calls steal your card info.', s: ['Loose or bulky card reader', 'Caller asks for full card number or CVV'], a: ['Use tap-to-pay', 'Call the number on your card', 'Turn on transaction alerts'] },
  { id: 'romance', n: 'Romance Scam', c: 'Online', how: 'An online sweetheart builds a relationship, then needs money for an emergency, travel, or fees.', s: ['Won\'t meet or video chat', 'Fast "love"', 'Requests for money'], a: ['Never send money to someone you haven\'t met', 'Reverse image search their photos', 'Talk to friends'] },
  { id: 'pig-butcher', n: 'Crypto "Pig Butchering"', c: 'Investing', how: 'A new online friend introduces a fake crypto platform that shows huge profits — until you try to withdraw.', s: ['Online friend gives investing tips', 'Unknown platform', 'Fees to withdraw'], a: ['Don\'t invest on a stranger\'s advice', 'Check the platform on regulator sites'] },
  { id: 'investment', n: 'Investment Fraud', c: 'Investing', how: 'Guaranteed high returns, "secret" opportunities, or exclusive groups. The biggest dollar-loss category in both FTC and FBI data.', s: ['Guaranteed returns', 'Pressure to act fast', 'Unregistered seller'], a: ['Check FINRA BrokerCheck and Investor.gov', 'Be skeptical of "no risk"'] },
  { id: 'celebrity', n: 'Deepfake Celebrity Endorsement', c: 'Investing', how: 'AI-generated videos of famous people promote fake investments, giveaways, or products.', s: ['Celebrity pitching crypto or miracle products', 'Lip-sync looks off', 'Too-good returns'], a: ['Check the celebrity\'s official accounts', 'Never trust ads alone'] },
  { id: 'recovery', n: 'Scam Recovery Scam', c: 'Investing', how: 'After you\'re scammed, someone offers to "recover" your money — for a fee.', s: ['Contacts you after a loss', 'Upfront fee', 'Claims to be law enforcement or lawyers'], a: ['Law enforcement doesn\'t charge to recover funds', 'Report at ic3.gov'] },
  { id: 'shopping', n: 'Fake Online Store', c: 'Shopping', how: 'Slick website, unbeatable prices — items never arrive or are junk.', s: ['Huge discounts', 'New domain or social ad', 'No contact info'], a: ['Search the store name + "scam"', 'Pay by credit card'] },
  { id: 'marketplace', n: 'Marketplace Seller/Buyer', c: 'Shopping', how: 'Fake sellers on Facebook Marketplace, Craigslist, etc. want deposits; fake buyers send fake payments or ask for codes.', s: ['Deposit to "hold" an item', 'Payment app only', 'Code to "verify"'], a: ['Meet in person in a safe spot', 'Inspect before paying'] },
  { id: 'tickets', n: 'Fake Event Tickets', c: 'Shopping', how: 'Sold-out concert or game tickets offered on social media at good prices — they\'re fake or resold many times.', s: ['Social media seller', 'Payment app only', 'Screenshot tickets'], a: ['Buy from official or reputable resale platforms'] },
  { id: 'pet', n: 'Puppy / Pet Scam', c: 'Shopping', how: 'Adorable pet for sale online — then endless fees for shipping, crates, insurance, or vaccinations.', s: ['Can\'t visit the pet', 'Repeated shipping fees', 'Stolen photos'], a: ['Meet the pet in person', 'Reverse image search the photos'] },
  { id: 'car', n: 'Vehicle Sale Scam', c: 'Shopping', how: 'A cheap car listed by a seller who\'s "deployed" or moving, sold via fake escrow.', s: ['Seller is away', 'Fake escrow/protection program', 'Gift card payments'], a: ['See the car in person', 'Run a VIN check'] },
  { id: 'lottery', n: 'Lottery & Sweepstakes', c: 'Prizes', how: 'You "won," but must pay taxes or fees first.', s: ['Never entered', 'Pay to collect', 'Foreign lottery'], a: ['Never pay to collect a prize'] },
  { id: 'job', n: 'Fake Job Offer', c: 'Jobs', how: 'Easy remote work with great pay — but you pay for training, equipment, or deposit a fake check.', s: ['No real interview', 'Pay to start', 'Chat-app recruiters'], a: ['Verify on company careers site', 'Never pay to work'] },
  { id: 'task', n: 'Task / "Like-for-Pay" Job', c: 'Jobs', how: 'Get paid to rate products or like videos — then deposit crypto to "unlock" bigger tasks.', s: ['Gamified tasks', 'Deposit to continue', 'Earnings you can\'t withdraw'], a: ['Real jobs never ask you to pay in'] },
  { id: 'mule', n: 'Money Mule / Reshipping', c: 'Jobs', how: '"Payment processor" or "package inspector" jobs use you to move stolen money or goods.', s: ['Receive & forward money', 'Reship packages', 'Use your own bank account'], a: ['Never move money for others — it can be a crime'] },
  { id: 'boss', n: 'Boss Imposter Gift Cards', c: 'Work', how: 'A text "from your boss" urgently asks you to buy gift cards for clients.', s: ['Personal number/email', 'Can\'t talk right now', 'Gift card request'], a: ['Call your boss on a known number', 'Report to IT/security'] },
  { id: 'bec', n: 'Business Email Compromise', c: 'Work', how: 'Fake vendor or executive emails redirect invoice payments or request wires.', s: ['Changed bank details', 'Look-alike domain', 'Skip approvals'], a: ['Call to verify bank changes', 'Follow approval steps'] },
  { id: 'friend-hacked', n: 'Hacked Friend Account', c: 'Online', how: 'Your friend\'s hacked account messages you asking for money, codes, or to click a link.', s: ['Unusual request', 'Off writing style', 'Won\'t talk by phone'], a: ['Call your friend directly'] },
  { id: 'sextortion', n: 'Sextortion / Blackmail', c: 'Online', how: 'Threats to share intimate images unless you pay — or bluff emails claiming webcam hacks.', s: ['Payment deadline', 'Crypto or gift cards', 'Old password shown as "proof"'], a: ['Don\'t pay; save evidence; report to ic3.gov', 'For minors: NCMEC CyberTipline & Take It Down'] },
  { id: 'charity', n: 'Fake Charity', c: 'Money', how: 'Scammers exploit disasters and causes with look-alike charity names.', s: ['Pressure to give now', 'Cash or crypto only', 'Vague details'], a: ['Verify on Charity Navigator or IRS search', 'Give by card or check'] },
  { id: 'debt', n: 'Debt Relief / Credit Repair', c: 'Money', how: 'Promises to erase debt or fix credit — after an upfront fee.', s: ['Upfront fees', 'Stop paying creditors', 'Guarantees'], a: ['Use a nonprofit credit counselor'] },
  { id: 'student-loan', n: 'Student Loan Forgiveness', c: 'Money', how: 'Callers promise fast forgiveness for a fee and ask for your FSA ID.', s: ['Fees for free programs', 'Asks for FSA ID', 'Fake "deadlines"'], a: ['Go to StudentAid.gov or your servicer'] },
  { id: 'car-warranty', n: 'Auto Warranty Robocall', c: 'Phone', how: '"We\'ve been trying to reach you about your car\'s extended warranty."', s: ['Robocall', 'Pressure to buy now', 'Asks for VIN and card info'], a: ['Hang up; check with your dealer', 'Register at DoNotCall.gov'] },
  { id: 'code', n: 'Verification Code Scam', c: 'Identity', how: 'Someone gets you to share a one-time code, letting them take over your account or open one in your name.', s: ['"Read me the code"', '"Prove you\'re real"', 'Code you didn\'t request'], a: ['Never share codes'] },
  { id: 'sim', n: 'SIM Swap', c: 'Identity', how: 'Criminals move your phone number to their device to intercept your codes.', s: ['Phone suddenly loses service', 'Password reset alerts'], a: ['Add a carrier PIN / number lock', 'Use an authenticator app'] },
  { id: 'account-takeover', n: 'Account Takeover / ID Theft', c: 'Identity', how: 'Stolen info is used to open accounts, file taxes, or drain your money.', s: ['Unknown accounts on credit report', 'Missing mail', 'Bills you don\'t recognize'], a: ['Freeze your credit at all three bureaus', 'Use IdentityTheft.gov'] },
  { id: 'rental', n: 'Rental Listing Scam', c: 'Home', how: 'Fake landlords post copied listings and collect deposits.', s: ['Below-market rent', 'Can\'t tour', 'Wire or app deposit'], a: ['Tour in person', 'Verify ownership'] },
  { id: 'contractor', n: 'Home Repair / Contractor', c: 'Home', how: 'Door-to-door "contractors" take upfront cash and do poor or no work.', s: ['Uninvited', 'Cash upfront', 'No contract or license'], a: ['Get three quotes and a written contract'] },
  { id: 'timeshare', n: 'Timeshare Resale / Exit', c: 'Home', how: 'Companies promise to sell or get you out of a timeshare — for big upfront fees.', s: ['Upfront fees', 'Guaranteed buyer', 'Pressure'], a: ['Never pay upfront; check reviews and your state attorney general'] }
];

/* ===== "I already paid / shared info" recovery ===== */
const RECOVERY = [
  { id: 'r-gift', icon: '🎁', t: 'I paid with a gift card', steps: ['Contact the gift card company right away — use the number on the back of the card or its website. Tell them it was used in a scam.', 'Keep the card and receipt.', 'Report it at ReportFraud.ftc.gov.'] },
  { id: 'r-wire', icon: '🏧', t: 'I sent a wire transfer', steps: ['Call the wire company or your bank immediately and ask to reverse it: Western Union 1-800-448-1492, MoneyGram 1-800-926-9400.', 'For bank wires, request a recall and a "hold harmless" letter.', 'File a report at ic3.gov.'] },
  { id: 'r-app', icon: '📲', t: 'I used Zelle, Venmo, Cash App, or PayPal', steps: ['Report the transaction in the app and ask to reverse it.', 'If linked to a bank or card, call them too.', 'Report at ReportFraud.ftc.gov.'] },
  { id: 'r-card', icon: '💳', t: 'I paid with a credit or debit card', steps: ['Call your card issuer to dispute the charge and request a new card.', 'Watch your statements for more charges.'] },
  { id: 'r-crypto', icon: '🪙', t: 'I sent cryptocurrency', steps: ['Contact the exchange or crypto ATM company you used right away.', 'Report at ic3.gov with wallet addresses and transaction IDs.', 'Beware of "recovery" services — they\'re usually a second scam.'] },
  { id: 'r-cash', icon: '✉️', t: 'I sent cash by mail or gave it to a courier', steps: ['If mailed, call the U.S. Postal Inspection Service: 1-877-876-2455. If you used UPS/FedEx, contact them to try to intercept it.', 'Call local police — especially if a courier came to your home.'] },
  { id: 'r-ssn', icon: '🪪', t: 'I gave my Social Security number', steps: ['Go to IdentityTheft.gov for a personalized recovery plan.', 'Freeze your credit (free) at Equifax 800-685-1111, Experian 888-397-3742, TransUnion 888-909-8872.', 'Check your credit reports at AnnualCreditReport.com.'] },
  { id: 'r-pass', icon: '🔑', t: 'I gave a password or a code', steps: ['Change that password immediately, plus anywhere you reused it.', 'Turn on two-step verification.', 'Contact the company and check for changes to your account.'] },
  { id: 'r-remote', icon: '🖥️', t: 'I let someone remote into my device', steps: ['Disconnect from the internet and uninstall any remote-access app they had you install.', 'Run a security scan.', 'Change passwords from a different, safe device; call your bank.'] },
  { id: 'r-bank', icon: '🏦', t: 'I gave bank account info', steps: ['Call your bank now using the number on your card or statement.', 'Ask about closing the account and setting up alerts.'] }
];

const REPORT_LINKS = [
  { t: 'ReportFraud.ftc.gov', d: 'Report any scam to the FTC', u: 'https://reportfraud.ftc.gov' },
  { t: 'ic3.gov', d: 'FBI Internet Crime Complaint Center', u: 'https://www.ic3.gov' },
  { t: 'IdentityTheft.gov', d: 'Recovery plan for stolen identity', u: 'https://www.identitytheft.gov' },
  { t: 'Elder Fraud Hotline', d: '833-FRAUD-11 (833-372-8311), weekdays', u: 'tel:18333728311' },
  { t: 'AARP Fraud Watch Helpline', d: '877-908-3360 — free for anyone', u: 'tel:18779083360' },
  { t: 'Forward scam texts', d: 'Text them to 7726 (SPAM)', u: 'sms:7726' }
];
