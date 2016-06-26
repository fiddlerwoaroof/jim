// Code goes here

subjectType = PresentationType('subject').bindTags();
verbType = PresentationType('verb').bindTags();
objectType = PresentationType('object').bindTags();

pickSentence = new Command(['subject', 'verb', 'object']);
pickSentence.execute = function(subject, verb, object) {
  var parent = document.querySelector('#sentence');

  if (parent.hasChildNodes()) {
    document.querySelector('#subjects').appendChild(
      parent.querySelector(subjectType.selector)
    );

    document.querySelector('#verbs').appendChild(
      parent.querySelector(verbType.selector)
    );

    document.querySelector('#objects').appendChild(
      parent.querySelector(objectType.selector)
    )
  }

  [subject,verb,object].forEach(function (el) {
    parent.appendChild(el.tag);
  });

}

randomSentence = new Command([]);
randomSentence.execute = function() {
 var subjects = subjectType.selectAll();
 var verbs = verbType.selectAll();
 var objects = objectType.selectAll();

 pickSentence.execute(
  subjects[Math.floor(Math.random()*3)],
  verbs[Math.floor(Math.random()*3)],
  objects[Math.floor(Math.random()*3)]
 );
}

document.querySelector('#pickSentence').addEventListener('click', pickSentence, false);
document.querySelector('#randomSentence').addEventListener('click', randomSentence, false);

/*
nameType = PresentationType('name');
nameType.bindTags();

occupationType = PresentationType('occupation').bindTags();

names = ['Bill', 'Bob', 'John'];

names.forEach(function(name) {
  var theTag = nameType.makeTag(
    name.toLowerCase(),
    'div',
    ['click'],
    name
  );
  document.querySelector('#names').appendChild(theTag.tag);
});

occupations = ['carpenter', 'weaver', 'fisher'];

occupations.forEach(function(occupation) {
  var theTag = occupationType.makeTag(
    occupation.toLowerCase(),
    'div',
    ['click'],
    occupation
  );
  
  document.querySelector('#occupations').appendChild(theTag.tag);
});

getPhrase = new Command(['name', 'occupation']);

getPhrase.execute = function (name, occupation) {
  document.querySelectorAll('.current').forEach(function(el) {
    el.classList.remove('current');
  });

  name.tag.classList.add('current');
  occupation.tag.classList.add('current');
  
  var heading = document.querySelector('h1');
  var oldname = heading.querySelector(nameType.selector);
  var oldoccupation = heading.querySelector(occupationType.selector);
  
  heading.textContent = '';
  
  if (oldname !== null) {
    document.querySelector('#names').appendChild(oldname);
  }
  heading.appendChild(name.tag);

  heading.appendChild(document.createTextNode(' the '));

  if (oldoccupation !== null) {
    document.querySelector('#occupations').appendChild(oldoccupation);
  }
  heading.appendChild(occupation.tag);

};
*/

