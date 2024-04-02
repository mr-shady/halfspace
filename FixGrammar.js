/**
 * this class is used to fix the grammar of the persian text
 * version 1.4.5
 * @param {*} String 
 * @param {*} options 
 */
function FixGrammar(String, options) {
    // default options /-> you can pass new values to this function
    let defaultOptions = {
        RemoveAllHalfSpaces: true,// remove all half spaces on each word
        Space: ' ',// default char for space
        HalfSpace: '‌',// default char for half space
        NoSpace: '',// default char for no space
        RegexSpacialChars: new RegExp(/[.,،:؛;?!؟]/, "gmiu"),
        RegexBefore: new RegExp(/\s+(?=[.,،:؛;?!؟])/, "gmiu"),
        RegexAfter: new RegExp(/(?<=[.,،:؛;?!؟])([^\s.,،:؛;?!؟])/, "gmiu"),
        AdjectiveEndingWithShodeh: [
            'گم',
            'رها',
            'غصب',
        ],
        VerbEndingWith: [
            'ی',
            'ها',
            'هایی',
            'های',
            'ام',
            'اند',
            'ای',
            'گان',
        ],
        VerbStartingWith: [
            'می',
            'نمی'
        ],
        PopularVerbs: [
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
        ],
        HalfSpaceException: [
            [
                ['نیم'],
                ['فاصله']
            ],
            [
                ['پس'],
                ['زمینه']
            ],
            [
                ['بی'],
                ['کلام']
            ],
            [
                ['گل'],
                [
                    'گفتن',
                    'شنیدن'
                ]
            ],
        ]
    }
    // merge options with default options
    options = {...defaultOptions, ...options};
    this.init = () => {
        this.CorrectSpecialSymbolsSpace();
        this.Fix();
        //this.log();
    }
    this.Fix = () => {
        let RegexSeparate = new RegExp(`(^${options.VerbStartingWith.join('|')})+($${options.PopularVerbs.join('|')})`, "gmiu");
        // جدا کردن کلمات با space
        let StringArray = String.split(options.Space);

        StringArray.forEach((Word, Index) => {
            Word = options.RemoveAllHalfSpaces ? this.RemoveHalfSpaces(Word) : Word;
            let CleanedWord = this.CleanWord(this.RemoveHalfSpaces(Word));
            CleanedWord = CleanedWord.replace(RegexSeparate, "$1" + options.HalfSpace + "$2");
            StringArray[Index] = Word;
            if (StringArray[Index + 1] !== undefined) {
                let NextWordClean = this.CleanWord(this.RemoveHalfSpaces(StringArray[Index + 1]));
                if (options.VerbEndingWith.includes(NextWordClean)) {
                    StringArray[Index] = Word + options.HalfSpace + this.RemoveHalfSpaces(StringArray[Index + 1]);
                    StringArray.splice(Index + 1, 1);
                } else if (NextWordClean === 'شده' && options.AdjectiveEndingWithShodeh.includes(CleanedWord)) {
                    StringArray[Index] = Word + options.HalfSpace + this.RemoveHalfSpaces(StringArray[Index + 1]);
                    StringArray.splice(Index + 1, 1);
                } else if (this.IsException(CleanedWord, NextWordClean)) {
                    StringArray[Index] = Word + options.HalfSpace + this.RemoveHalfSpaces(StringArray[Index + 1]);
                    StringArray.splice(Index + 1, 1);
                }
            }
            if (options.VerbStartingWith.includes(CleanedWord)) {
                StringArray[Index] = Word + options.HalfSpace + this.RemoveHalfSpaces(StringArray[Index + 1]);
                StringArray.splice(Index + 1, 1);
            }
        });
        String = StringArray.join(" ");
    }
    this.CorrectSpecialSymbolsSpace = () => {
        String = String
            .replace(options.RegexBefore, "")//remove space before special symbols
            .replace(options.RegexAfter, " $1");//add space after special symbols
    }
    this.CleanWord = (Word) => {
        let RegexSpacialChars = new RegExp(/[.,،:؛;?!؟]/, "gmiu");
        return Word.replace(RegexSpacialChars, "");
    }
    this.RemoveHalfSpaces = (Word) => {
        Word = this.Rtrim(Word, ' ');
        Word = this.Rtrim(Word, '‌');
        Word = this.Ltrim(Word, ' ');
        Word = this.Ltrim(Word, '‌');
        return Word;
    }
    this.Rtrim = (str, chr) => {
        let rgxtrim = (!chr) ? new RegExp('\\s+$') : new RegExp(chr + '+$');
        return str.replace(rgxtrim, '');
    }
    this.Ltrim = (str, chr) => {
        let rgxtrim = (!chr) ? new RegExp('^\\s+') : new RegExp('^' + chr + '+');
        return str.replace(rgxtrim, '');
    }
    this.IsException = (Word, NextWord) => {
        let IsException = false;
        options.HalfSpaceException.forEach(Exception => {
            if (Exception[0].includes(Word) && Exception[1].includes(NextWord)) {
                IsException = true;
            }
        });
        return IsException;
    }
    this.log = () => {
        console.log(String)
    }
    this.get = () => {
        return String;
    }
    this.init();
}

