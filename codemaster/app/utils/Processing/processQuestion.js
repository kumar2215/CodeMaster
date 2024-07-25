import { toast } from 'react-toastify';

export default function processAndValidateQuestion(question, idx) {

  const i = idx ? idx + 1 : '';

  // check if there is a title
  if (!question.title) {
    toast.error(`Please set a title for question ${i}`, {autoClose: 3000});
    return false;
  }

  // check if there is a type
  if (!question.type) {
    toast.error(`Please set a type for question ${i}`, {autoClose: 3000});
    return false;
  }
  
  // check if there is a difficulty
  if (!question.difficulty) {
    toast.error(`Please set a difficulty for question ${i}`, {autoClose: 3000});
    return false;
  }

  // check if there is a language
  if (!question.language) {
    toast.error(`Please set a language for question ${i}`, {autoClose: 3000});
    return false;
  }

  // check if there is a source
  if (!question.source.src) {
    toast.error(`Please set a source for question ${i}`, {autoClose: 3000});
    return false;
  }

  // check if there is any content
  if (!question.contents.length) {
    toast.error(`Please set some content for question ${i}`, {autoClose: 3000});
    return false;
  }
  
  // check if given content is not empty
  for (let k = 0; k < question.contents.length; k++) {
    if (!question.contents[k] || question.contents[k].value.trim() === "") {
      toast.error(`Question ${i} has an empty content field`, {autoClose: 3000});
      return false;
    }
  }

  // check if there are any parts
  if (question.parts.length === 0) {
    toast.error(`Question ${i} has no parts`, {autoClose: 3000});
    return false;
  }

  return {
    ...question,
    content: question.contents,
    source: {
      link: question.source.src.includes('https') || question.source.src.includes('wwww'),
      src: question.source.src
    },
    parts: question.parts.map((part, index) => {

      let partValue;
      if (question.parts.length === 1) {
        partValue = "";
      } else {
        partValue = "part " + String.fromCharCode(index + 65).toLowerCase();
      }
      
      // check if there is a question
      if (part.question === '') {
        toast.error(`Question ${i} ${partValue} has no question`, {autoClose: 3000});
        return false;
      }

      if (part.questionType === "Multiple-Responses" || part.questionType === "Freestyle") {
        
        // check if points are valid
        const pointsArray = part.points.map(point => Number(point));
        pointsArray.forEach(points => {
          if (points <= 0) {
            toast.error(`Question ${i} ${partValue} has non-positive points`, {autoClose: 3000});
            return false;
          }
        })
        
        if (part.questionType === "Multiple-Responses") {

          // check if format is not empty
          if (part.format === '') {
            toast.error(`Question ${i} ${partValue} has an empty format`, {autoClose: 3000});
            return false;
          }
          const formatArray = part.format.split(',').map(f => f.trim() !== '' ? f.trim() : '').filter(f => f !== '');

          // check if inputs are not empty
          if (part.inputs.length === 0) {
            toast.error(`Question ${i} ${partValue} has no inputs`, {autoClose: 3000});
            return false;
          }
          
          // check if inputs are valid
          for (let j = 0; j < part.inputs.length; j++) {
            const input = part.inputs[j];
            for (let k = 0; k < formatArray.length; k++) {
              if (input[formatArray[k]] === undefined) {
                toast.error(`Question ${i} ${partValue} input ${j+1} has missing field ${formatArray[k]}`, {autoClose: 3000});
                return false;
              }
            }
            if (input.expected === '' || input.expected === undefined) {
              toast.error(`Question ${i} ${partValue} input ${j+1} has no expected field`, {autoClose: 3000});
              return false;
            }
          }

          return { ...part, part: partValue ? partValue.split(" ")[1] : "null", points: pointsArray, format: formatArray };
        }

        if (part.questionType === "Freestyle") {
          // check if user code is present
          if (part.code === '') {
            toast.error(`Question ${i} ${partValue} needs to have usercode`, {autoClose: 3000})
            return false;
          }

          // check if function name is present
          if (part.functionName === '') {
            toast.error(`Question ${i} ${partValue} needs to have a main function name`, {autoClose: 3000})
            return false;
          }

          // check if user code has main function name
          if (!part.code.includes(part.functionName)) {
            toast.error(`Question ${i} ${partValue}'s usercode needs to contain the main function name`, {autoClose: 3000})
            return false;
          }

          // check if user code has main class name if given
          if (part.className !== '' && !part.code.includes(part.className)) {
            toast.error(`Question ${i} ${partValue}'s usercode needs to contain the main class name given`, {autoClose: 3000})
            return false;
          }

          // check if class name is given if language is java
          if (question.language.toLowerCase() === 'java' && part.className === '') {
            toast.error(`Question ${i} ${partValue} needs to have a class name since language set is Java`, {autoClose: 3000})
            return false;
          }

          // check if given parameters are not empty
          if (part.parameters.length === 0) {
            toast.error(`Question ${i} ${partValue} has no parameters`, {autoClose: 3000});
            return false;
          }

          // check if given parameters are valid
          for (let j = 0; j < part.parameters.length; j++) {
            const parameter = part.parameters[j];
            if (parameter.name === '') {
              toast.error(`Question ${i} ${partValue} parameter ${j+1} has empty name`, {autoClose: 3000});
              return false;
            }
            if (parameter.type === '') {
              toast.error(`Question ${i} ${partValue} parameter ${j+1} has empty type`, {autoClose: 3000});
              return false;
            }
          }

          const pre_code = part.precode;
          const post_code = part.postcode;
          const refactoring = question.type === "Refactoring";

          return { ...part, part: partValue ? partValue.split(" ")[1] : "null", points: pointsArray, pre_code, post_code, refactoring };
        }
      }

      if (part.questionType === "MCQ" || part.questionType === "MRQ") {

        // check if there are options
        if (!part.options || part.options.length === 0) {
          toast.error(`Question ${i} ${partValue} has no options`, {autoClose: 3000});
          return false;
        }

        // check if there is more than one option
        if (part.options.length < 2) {
          toast.error(`Question ${i} ${partValue} needs more than 1 option`, {autoClose: 3000});
          return false;
        }
        
        // check if options are not empty
        for (let k = 0; k < part.options.length; k++) {
          if (part.options[k].value.trim() === "") {
            toast.error(`Question ${i} ${partValue} option ${k+1} is empty`, {autoClose: 3000});
            return false;
          }
        }

        // check if options contain duplicates
        const optionValues = part.options.map(option => option.value);
        if (new Set(optionValues).size !== optionValues.length) {
          toast.error(`Question ${i} ${partValue} has duplicate options`, {autoClose: 3000});
          return false;
        }

        // add language to options
        part.options = part.options.map(
          option => option.category === "code" ? { ...option, language: question.language } : option
        );

        const points = Number(part.points);
        // check if points is positive
        if (points <= 0) {
          toast.error(`Question ${i} ${partValue} has non-positive points`, {autoClose: 3000});
          return false;
        }

        const L = part.options.length;
        // check if expected option is within nunber of options
        if (part.questionType === "MCQ") {
          part.expected = Number(part.expected);
          if (part.expected <= 0 || part.expected > L) {
            toast.error(`Question ${i} ${partValue}'s right option has to be within the option numbers`, {autoClose: 3000});
            return false;
          }
          return { ...part, part: partValue ? partValue.split(" ")[1] : "null", expected: part.expected, points };
        }

        if (part.questionType === "MRQ") {
          const expectedArray = part.expected.split(',').map(val => Number(val.trim()));
          for (let k = 0; k < part.expected.length; k++) {
            if (expectedArray[k] <= 0 || expectedArray > L) {
              toast.error(`Question ${i} ${partValue}\n Right option has to be within the option numbers`, {autoClose: 3000});
              return false;
            }
          }
          return { ...part, part: partValue ? partValue.split(" ")[1] : "null", expected: expectedArray, points };
        }
      }

    })
  
  };

}