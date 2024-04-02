<?php
/**
 * This class is used to fix the grammar of the Persian text
 * Version 1.4.5
 * @param string $string
 * @param array $options
 */
class FixGrammar {
    private $string;
    private $options;

    public function __construct($string, $options = []) {
        // Default options
        $defaultOptions = [
            'RemoveAllHalfSpaces' => true, // Remove all half spaces on each word
            'Space' => ' ', // Default char for space
            'HalfSpace' => '‌', // Default char for half space
            'NoSpace' => '', // Default char for no space
            'RegexSpacialChars' => '/[.,،:؛;?!؟]/u', // Regular expression for special characters
            'RegexBefore' => '/\s+(?=[.,،:؛;?!؟])/u', // Regular expression for space before special characters
            'RegexAfter' => '/(?<=[.,،:؛;?!؟])([^\s.,،:؛;?!؟])/u', // Regular expression for space after special characters
            'AdjectiveEndingWithShodeh' => [
                'گم',
                'رها',
                'غصب',
            ],
            'VerbEndingWith' => [
                'ی',
                'ها',
                'های',
                'ام',
                'اند',
                'ای',
                'گان',
            ],
            'VerbStartingWith' => [
                'می',
                'نمی',
            ],
            'PopularVerbs' => [
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
            'HalfSpaceException' => [
                [
                    ['نیم'],
                    ['فاصله'],
                ],
                [
                    ['پس'],
                    ['زمینه'],
                ],
                [
                    ['بی'],
                    ['کلام'],
                ],
                [
                    ['گل'],
                    [
                        'گفتن',
                        'شنیدن',
                    ],
                ],
            ],
        ];

        // Merge options with default options
        $this->options = array_merge($defaultOptions, $options);
        $this->string = $string;
        $this->init();
    }

    private function init() {
        $this->correctSpecialSymbolsSpace();
        $this->fix();
        // $this->log();
    }

    private function fix() {
        $regexSeparate = '/(^' . implode('|', $this->options['VerbStartingWith']) . ')+($' . implode('|', $this->options['PopularVerbs']) . ')/u';

        // Separate words with space
        $stringArray = explode($this->options['Space'], $this->string);

        foreach ($stringArray as $index => &$word) {
            $word = $this->options['RemoveAllHalfSpaces'] ? $this->removeHalfSpaces($word) : $word;
            $cleanedWord = $this->cleanWord($this->removeHalfSpaces($word));
            $cleanedWord = preg_replace($regexSeparate, "$1" . $this->options['HalfSpace'] . "$2", $cleanedWord);
            $stringArray[$index] = $word;

            if (isset($stringArray[$index + 1])) {
                $nextWordClean = $this->cleanWord($this->removeHalfSpaces($stringArray[$index + 1]));

                if (in_array($nextWordClean, $this->options['VerbEndingWith'])) {
                    $stringArray[$index] = $word . $this->options['HalfSpace'] . $this->removeHalfSpaces($stringArray[$index + 1]);
                    array_splice($stringArray, $index + 1, 1);
                } elseif ($nextWordClean === 'شده' && in_array($cleanedWord, $this->options['AdjectiveEndingWithShodeh'])) {
                    $stringArray[$index] = $word . $this->options['HalfSpace'] . $this->removeHalfSpaces($stringArray[$index + 1]);
                    array_splice($stringArray, $index + 1, 1);
                } elseif ($this->isException($cleanedWord, $nextWordClean)) {
                    $stringArray[$index] = $word . $this->options['HalfSpace'] . $this->removeHalfSpaces($stringArray[$index + 1]);
                    array_splice($stringArray, $index + 1, 1);
                }
            }

            if (in_array($cleanedWord, $this->options['VerbStartingWith'])) {
                $stringArray[$index] = $word . $this->options['HalfSpace'] . $this->removeHalfSpaces($stringArray[$index + 1]);
                array_splice($stringArray, $index + 1, 1);
            }
        }

        $this->string = implode($this->options['Space'], $stringArray);
    }

    private function correctSpecialSymbolsSpace() {
        $this->string = preg_replace($this->options['RegexBefore'], '', $this->string); // Remove space before special symbols
        $this->string = preg_replace($this->options['RegexAfter'], ' $1', $this->string); // Add space after special symbols
    }

    private function cleanWord($word) {
        return preg_replace($this->options['RegexSpacialChars'], '', $word);
    }

    private function removeHalfSpaces($word) {
        $word = $this->rtrim($word, ' ');
        $word = $this->rtrim($word, '‌');
        $word = $this->ltrim($word, ' ');
        $word = $this->ltrim($word, '‌');
        return $word;
    }

    private function rtrim($str, $chr = null) {
        $rgxtrim = (!$chr) ? '/\s+$/u' : '/(' . preg_quote($chr, '/') . ')+$/u';
        return preg_replace($rgxtrim, '', $str);
    }

    private function ltrim($str, $chr = null) {
        $rgxtrim = (!$chr) ? '/^\s+/u' : '/^(' . preg_quote($chr, '/') . ')+/u';
        return preg_replace($rgxtrim, '', $str);
    }

    private function isException($word, $nextWord) {
        foreach ($this->options['HalfSpaceException'] as $exception) {
            if (in_array($word, $exception[0]) && in_array($nextWord, $exception[1])) {
                return true;
            }
        }
        return false;
    }

    public function get() {
        return $this->string;
    }

    public function log() {
        echo $this->string;
    }
}

// Usage
$string = "این متن برای می باشد نمی باشد ؟ چی ! نمی فهمی .";


$fixGrammar = new FixGrammar($string);
$fixedString = $fixGrammar->get();

echo $fixedString;
