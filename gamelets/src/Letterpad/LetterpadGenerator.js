/**
 * Created by Anoxic on 6/24/2017.
 */

const STOP_WORDS = "a able about above abst accordance according accordingly across act actually added adj affected affecting affects after afterwards again against ah all almost alone along already also although always am among amongst an and announce another any anybody anyhow anymore anyone anything anyway anyways anywhere apparently approximately are aren arent arise around as aside ask asking at auth available away awfully b back be became because become becomes becoming been before beforehand begin beginning beginnings begins behind being believe below beside besides between beyond biol both brief briefly but by c ca came can cannot cant cause causes certain certainly co com come comes contain containing contains could couldnt d date did didnt different do does doesnt doing done dont down downwards due during e each ed edu effect eg eight eighty either else elsewhere end ending enough especially et et-al etc even ever every everybody everyone everything everywhere ex except f far few ff fifth first five fix followed following follows for former formerly forth found four from further furthermore g gave get gets getting give given gives giving go goes gone got gotten h had happens hardly has hasnt have havent having he hed hence her here hereafter hereby herein heres hereupon hers herself hes hi hid him himself his hither home how howbeit however hundred i id ie if ill im immediate immediately importance important in inc indeed index information instead into invention inward is isnt it itd itll its itself ive j just k keep keeps kept kg km know known knows l largely last lately later latter latterly least less lest let lets like liked likely line little ll look looking looks ltd m made mainly make makes many may maybe me mean means meantime meanwhile merely mg might million miss ml more moreover most mostly mr mrs much mug must my myself n na name namely nay nd near nearly necessarily necessary need needs neither never nevertheless new next nine ninety no nobody non none nonetheless noone nor normally nos not noted nothing now nowhere o obtain obtained obviously of off often oh ok okay old omitted on once one ones only onto or ord other others otherwise ought our ours ourselves out outside over overall owing own p page pages part particular particularly past per perhaps placed please plus poorly possible possibly potentially pp predominantly present previously primarily probably promptly proud provides put q que quickly quite qv r ran rather rd re readily really recent recently ref refs regarding regardless regards related relatively research respectively resulted resulting results right run s said same saw say saying says sec section see seeing seem seemed seeming seems seen self selves sent seven several shall she shed shell shes should shouldnt show showed shown showns shows significant significantly similar similarly since six slightly so some somebody somehow someone somethan something sometime sometimes somewhat somewhere soon sorry specifically specified specify specifying still stop strongly sub substantially successfully such sufficiently suggest sup sure t take taken taking tell tends th than thank thanks thanx that thatll thats thatve the their theirs them themselves then thence there thereafter thereby thered therefore therein therell thereof therere theres thereto thereupon thereve these they theyd theyll theyre theyve think this those thou though thoughh thousand throug through throughout thru thus til tip to together too took toward towards tried tries truly try trying ts twice two u un under unfortunately unless unlike unlikely until unto up upon ups us use used useful usefully usefulness uses using usually v value various ve very via viz vol vols vs w want wants was wasnt way we wed welcome well went were werent weve what whatever whatll whats when whence whenever where whereafter whereas whereby wherein wheres whereupon wherever whether which while whim whither who whod whoever whole wholl whom whomever whos whose why widely willing wish with within without wont words world would wouldnt www x y yes yet you youd youll your youre yours yourself yourselves youve z zero retrieved pdf pmid eds sci doi isbn retrieve january february march april may june july august september november december state main".split(
    " ");
const DEFAULT_BUCKET_SIZE = 5,
    DEFAULT_WORD_SIZE = 10,
    DEFAULT_LETTER_SIZE = 9;

function sanitizeMaps(obj, entry) {
  for (let word of STOP_WORDS) {
    delete obj[word];
  }

  delete obj[entry];
}

function generateSortedMap(obj) {
  let keys = Object.keys(obj);

  let array = [];

  for (let key of keys) {
    array.push({
      word: key,
      freq: obj[key],
    });
  }

  return array.sort((lhs, rhs) => rhs.freq - lhs.freq);
}

function generateMaps(p, entry, filterWords) {
  // First, remove puncuations
  let groups = p.toLowerCase().replace(/[^ a-zA-Z]/g, "").split(/[ \r\n]/);

  let obj = {};
  for (let i = 0; i < groups.length; ++i) {
    let word = groups[i];
    if (word && word.length > 2 && filterWords.indexOf(word) === -1) {
      if (!obj[word] && obj[word.slice(0, -1)]) {
        word = word.slice(0, -1);
      } else if (!obj[word] && obj[word + 's']) {
        let freq = obj[word + 's'];
        delete obj[word + 's'];
        obj[word] = freq;
      }

      obj[word] = (obj[word] || 0) + 1;
    }
  }

  // Remove stop words
  sanitizeMaps(obj, entry);

  return generateSortedMap(obj);
}

function isFitInGroup(group, set) {
  let uniques = 0;
  for (let letter of set) {
    if (group.indexOf(letter) === -1) {
      ++uniques;
    }
  }

  return uniques + group.length <= DEFAULT_LETTER_SIZE;
}

function addToGroup(group, set) {
  for (let letter of set) {
    if (group.indexOf(letter) === -1) {
      group.push(letter);
    }
  }
}

function allBucketsFull(buckets) {
  for (let bucket of buckets) {
    if (bucket.length !== DEFAULT_WORD_SIZE) {
      return false;
    }
  }

  return true;
}

function generatePossibleWords(map) {

  let words = map.map(elem => elem.word);
  let buckets = words.slice(0, DEFAULT_BUCKET_SIZE).map(word => [word]),
      letters = buckets.map(wordArray => wordArray[0].split(""));

  for (let word of words) {
    for (let i = 0; i < DEFAULT_BUCKET_SIZE; ++i) {
      let bucket = buckets[i],
          letterGroup = letters[i];

      if (bucket.indexOf(word) !== -1) {
        break;
      }

      let set = word.split("").filter((v, i, s) => s.indexOf(v) === i);
      if (isFitInGroup(letterGroup, set)) {
        if (bucket.length < DEFAULT_WORD_SIZE) {
          bucket.push(word);
          addToGroup(letterGroup, set);
        }
      }
    }

    if (allBucketsFull(buckets)) {
      return buckets;
    }
  }

  return buckets;
}

function print(list) {
  console.log("Letters ",
      getLettersFromList(list),
      " | Words: ",
      list.join(" "));
};

function printList(lists) {
  for (let list of lists) {
    print(list);
  }
}

function generateWords(p, entry, filterWords) {
  filterWords = filterWords || [];
  let obj = generateMaps(p, entry, filterWords);
  let wordLists = generatePossibleWords(obj);

  return wordLists;
}

function getLettersFromList(list) {
  let letters = {};
  for (let word of list) {
    let group = word.split("");
    for (let letter of group) {
      letters[letter] = 1;
    }
  }

  return Object.keys(letters).join("");
}

import React, {Component} from "react";

export default class LetterpadGenerator extends Component {

  state = {
    entry      : "",
    passage    : "",
    words      : [],
    filterWords: [],
  };

  results = [];

  constructor(props) {
    super(props);

    this.fetch = this.fetch.bind(this);
    this.print = this.print.bind(this);
  }

  print(list) {
    this.results.push(`{prompt:"${this.state.entry}",letters:"${getLettersFromList(
        list)}",words:["${list.join(`","`)}"]}`);
  };


  componentWillUpdate(nextProps, nextState) {
    nextState.words = generateWords(nextState.passage,
        nextState.entry,
        nextState.filterWords);

  }

  handlePassageChange(e) {
    this.setState({
      passage: e.target.value,
    });
  }

  fetch() {
    let entry = this.state.entry;
    fetch(
        `https://en.wikipedia.org/w/api.php?action=parse&format=json&prop=text&page=${entry}&callback=?`)
        .then(e => e.text())
        .then(e => JSON.parse(e.slice(5, -1)).parse.text["*"].split("\n")
            .join(" "))
        .then(e => {
          let tmp = document.createElement("DIV");
          tmp.innerHTML = e;
          return tmp.textContent || tmp.innerText || "";
        })
        .then(e => this.setState({passage: e, filterWords: []}));
  }

  render() {
    return (
        <div className="">
          <h1>Entry</h1>
          <input value={this.state.entry}
                    onKeyDown={e => {
                      if (e.keyCode === 13) {
                        this.fetch();
                        e.preventDefault();
                      }
                    }}
                    onChange={e => this.setState({entry: e.target.value})}/>
          <a onClick={this.fetch}>FETCH</a>
          <h1>Passage</h1>
          <textarea style={{fontSize: "12px"}} value={this.state.passage}
                    onChange={this.handlePassageChange.bind(this)}></textarea>
          <h1>Filter words</h1>
          {this.state.filterWords.join()}
          <h1>Result</h1>
          {this.state.words.map((words, i) =>
              <div key={i}>
                <h2 onClick={() => this.print(words)} style={{color: getLettersFromList(words).length === 9 ? "black" : "red"}}>{getLettersFromList(words)}</h2>
                {words.map(word =>
                    <a style={{padding: "10px"}} key={word}
                       onClick={() => this.setState({filterWords: [...this.state.filterWords, word]})}>{word}</a>
                )}
              </div>
          )}
          <h1>Cache</h1>
          {this.results.map(result =>
              <p>{result}</p>
          )}

          <a onClick={() => this.setState({
            entry      : "",
            passage    : "",
            words      : [],
            filterWords: []
          })}>reset</a>
        </div>
    );
  }
}