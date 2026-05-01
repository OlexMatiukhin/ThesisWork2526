export function getActiveParamBlock(){
      const systemSelect = document.getElementById('system');
      const activeId = systemSelect.value;
      const activeParamBlock = document.getElementById(`${activeId}-params`);
      return activeParamBlock;
}

function showValidationError(input, message) {
    alert(message);
    input.focus();
    input.reportValidity();
}
function parseNumberInput(input) {
    const raw = (input.value ?? "").trim().replace(",", ".");
    const value = Number(raw);
    return { raw, value };
}


const blockRules = {
    "lorenz-params": {
        lorenzX: { min: -20, max: 20 },
        lorenzY: { min: -20, max: 20 },
        lorenzZ: { min: 0, max: 60 }
    },

    "rossler-params": {
        rosslerX: { min: -15, max: 15 },
        rosslerY: { min: -15, max: 15 },
        rosslerZ: { min: 0, max: 25 }
    },

    "chua-params": {
        chuaX: { min: -3, max: 3 },
        chuaY: { min: -2, max: 2 },
        chuaZ: { min: -3, max: 3 }
    },

    "duffing-params": {
        duffingX: { min: -2, max: 2 },
        duffingY: { min: -2, max: 2 },
        duffingT: { min: undefined, max:undefined }
    },

    "pol-params": {
        polX: { min: -3, max: 3 },
        polY: { min: -8, max: 8 },
        polT: { min: undefined, max:undefined }
    },

    "forced-params": {
        forcedX: { min: -Math.PI, exclusiveMax: Math.PI }, 
        forcedY: { min: -6, max: 6 },  
        forcedT:  { min: undefined, max:undefined }               
    }
};


function validateContinuousSystemParams(activeBlock, paramsObj) {
    const rules = blockRules[activeBlock.id];
    for (const [fieldName, limits] of Object.entries(rules)) {
        const input = activeBlock.querySelector(`[name="${fieldName}"]`);
       
        const { value } = parseNumberInput(input);
   if (input.validity.badInput || value === "" || !Number.isFinite(value)) {
            showValidationError(input, `"${fieldName}" має бути числом`);
            return { validationPassed: false, paramsObj: null };
        }
        if (limits.min !== undefined && value < limits.min) {
            showValidationError(
                input,
                `"${fieldName}" має бути не менше ${limits.min}`
            );
            return { validationPassed: false, paramsObj: null };
        }
        if (limits.max !== undefined && value > limits.max) {
            showValidationError(
                input,
                `"${fieldName}" має бути не більше ${limits.max}`
            );
            return { validationPassed: false, paramsObj: null };
        }
        paramsObj[fieldName] = value;
    }

    return { validationPassed: true, paramsObj };
}

export function validateActiveParams(){
    const activeBlock = getActiveParamBlock();
    const paramsObj = {};
    if(! activeBlock){
        alert("Немає видимого блоку з параметрами!")
        return {validationPassed: false, paramsObj:null}
    }

     const logisticInput = [...activeBlock.querySelectorAll("input[type='number']")]
        .find(input => input.name.toLowerCase().startsWith("logistic"));

    if (!logisticInput) {
        alert("Поле logisticX не знайдено");
        return { validationPassed: false, paramsObj: null };
    }

    const { value: logisticValue } = parseNumberInput(logisticInput);

  if (logisticInput.validity.badInput || logisticValue === "" || !Number.isFinite(logisticValue)) {
        showValidationError(logisticInput, `"${logisticInput.name}" має бути числом`);
        return { validationPassed: false, paramsObj: null };
    }

    if (!(logisticValue > 0 && logisticValue < 1)) {
        showValidationError(
            logisticInput,
            `"${logisticInput.name}" має бути в діапазоні (0,1)`
        );
        return { validationPassed: false, paramsObj: null };
    }
    paramsObj[logisticInput.name] = logisticValue;
    return validateContinuousSystemParams(activeBlock, paramsObj);
}