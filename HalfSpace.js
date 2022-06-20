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
];
const rtrim = (str, chr) => {
    var rgxtrim = (!chr) ? new RegExp('\\s+$') : new RegExp(chr + '+$');
    return str.replace(rgxtrim, '');
}
const ltrim = (str, chr) => {
    var rgxtrim = (!chr) ? new RegExp('^\\s+') : new RegExp('^' + chr + '+');
    return str.replace(rgxtrim, '');
}
const RemoveHalfSpaces = (s) => {
    s = rtrim(s, ' ');
    s = rtrim(s, '‌');
    s = ltrim(s, ' ');
    s = ltrim(s, '‌');
    return s;
}
const ClearText = (String) => {
    const RegexSpacialChars = new RegExp(/[.,،:؛;?!؟]/, "gmiu");
    return String.replace(RegexSpacialChars, "");
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
        Text = RemoveHalfSpaces(Text);
        let CleanText = ClearText(RemoveHalfSpaces(Text));
        CleanText = CleanText.replace(RegexSperate, "$1" + HalfSpace + "$2");
        StringArray[Index] = Text;
        if (StringArray[Index + 1] !== undefined) {
            let NextTextClean = ClearText(RemoveHalfSpaces(StringArray[Index + 1]));
            if (VerbEndingWith.includes(NextTextClean)) {
                console.log(Text + ' ' +NextTextClean);
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
    MainString = StringArray.join(" ");
    return MainString;
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