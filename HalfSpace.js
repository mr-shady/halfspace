//صفاتی که با شده تمام می شوند
const AdjectiveEndingWithShodeh = [
    'گم',
    'رها',
    'غصب',
    //TODO : need to complete this list later
];
//افعالی که با موارد زیر تمام می شوند
const VerbEndingWith = [
    'ی',
    'ها',
    'های',
    'ام',
    'اند',
    'ای',
    'گان',
];
//افعالی که با موارد زیر شروع می شوند
const VerbStartingWith = [
    'می',
    'نمی'
];
//افعال پر استفاده که باید جدا شوند
const PopularVerbs = [
    'باشد',
    'آید',
    'شود',
    'رود',
    'روی',
    'شد',
    'شدند',
    'رفتند',
    'مردند',
    'رقصیدند',
];
const HalfSpaceException = [
    [
        ['نیم'],
        ['فاصله']
    ],
    [
        ['گل'],
        [
            'گفتن',
            'شنیدن'
        ]
    ],
]
const RemoveHalfSpaces = (s) => {
    const RegexHalfSpace = new RegExp(/(^ |‌)/, "gmiu");
    const RegexHalfSpace2 = new RegExp(/($ |‌)/, "gmiu");
    return s.replace(RegexHalfSpace, '').replace(RegexHalfSpace2, '');
}
const GrammarCorrection = (MainString) => {
    const Space = ' ';
    const HalfSpace = String.fromCodePoint(8204);
    const NoSpace = '';
    const RegexSpacialChars = new RegExp(/[.,،:؛;?!؟]/, "gmiu");
    const RegexBefore = new RegExp(/\s+(?=[.,،:؛;?!؟])/, "gmiu");
    const RegexAfter = new RegExp(/(?<=[.,،:؛;?!؟])([^\s.,،:؛;?!؟])/, "gmiu");
    const RegexSperate = new RegExp(`(^${VerbStartingWith.join('|')})+($${PopularVerbs.join('|')})`, "gmiu");
    MainString = MainString
        .replace(RegexBefore, "")
        .replace(RegexAfter, " $1");
    let StringArray = MainString.split(" ");
    StringArray.forEach((Text, Index) => {
        Text = RemoveHalfSpaces(Text.trim());
        let CleanText = RemoveHalfSpaces(Text);
        CleanText = CleanText.replace(RegexSperate, "$1" + HalfSpace + "$2");
        StringArray[Index] = CleanText;
        if (StringArray[Index + 1] !== undefined) {
            let NextTextClean = RemoveHalfSpaces(StringArray[Index + 1]);
            if (VerbEndingWith.includes(NextTextClean)) {
                StringArray[Index] = Text + HalfSpace + RemoveHalfSpaces(StringArray[Index + 1]);
                StringArray.splice(Index + 1, 1);
            } else if (NextTextClean === 'شده' && AdjectiveEndingWithShodeh.includes(CleanText)) {
                StringArray[Index] = Text + HalfSpace + RemoveHalfSpaces(StringArray[Index + 1]);
                StringArray.splice(Index + 1, 1);
            } else if (IsException(CleanText, NextTextClean)) {
                StringArray[Index] = Text + HalfSpace + RemoveHalfSpaces(StringArray[Index + 1]);
                StringArray.splice(Index + 1, 1);
            }
        }
        if (VerbStartingWith.includes(CleanText)) {
            StringArray[Index] = Text + HalfSpace + RemoveHalfSpaces(StringArray[Index + 1]);
            StringArray.splice(Index + 1, 1);
        }
    });
    return StringArray.join(" ");
}
const IsException = (CleanText, NextTextClean) => {
    let IsException = false;
    HalfSpaceException.forEach(Exception => {
        if (Exception[0].includes(CleanText) && Exception[1].includes(NextTextClean)) {
            IsException = true;
        }
    });
    return IsException;
}
const CheckGrammar = (Element, ResultElement) => {
    const String = document.querySelector(Element).value;
    if (ResultElement === undefined) {
        ResultElement = Element;
    }
    document.querySelector(ResultElement).value = (GrammarCorrection(String));
}