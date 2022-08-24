package utils

import "reflect"

func getStructTag(f reflect.StructField, tagName string) string {
	return f.Tag.Get(tagName)
}

func CleanStruct(input interface{}) interface{} {
	for reflect.TypeOf(input).Kind() == reflect.Ptr {
		input = reflect.ValueOf(input).Elem().Interface()
	}

	output := map[string]interface{}{}
	inputType := reflect.TypeOf(input)
	inputValue := reflect.ValueOf(input)
	for i := 0; i < inputType.NumField(); i++ {
		element := inputType.Field(i)
		hideTag := getStructTag(element, "hide")
		if !element.IsExported() || hideTag == "true" {
			continue
		}

		output[element.Name] = inputValue.FieldByName(element.Name).Interface()
	}

	if len(output) == 0 {
		return nil
	}

	return output
}
