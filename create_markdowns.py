import os
import json
import pathlib


def generate_all_docs(replace_all: bool = False):
    target_files = []
    cwd = os.getcwd()

    for file in os.scandir(cwd):
        filename = os.fsdecode(file)
        if filename == "assets" or filename == "markdown":
            continue
        if filename[-2:] == "js":
            target_files.append(file)
            
        if file.is_dir():
            for sub_file in os.scandir(file):
                sub_filename = os.fsdecode(sub_file)
                if sub_filename[-2:] == "js":
                    target_files.append(sub_file)
                                        
    for target in target_files:
        target_filename = os.fsdecode(target)
        md_filename = f"{target_filename[:-2]}md"
        md_path = f"markdown/{md_filename}"
        if os.path.exists(md_path) and not replace_all:
            continue
                                 
        generate_doc(target_filename)
            
            
def generate_doc(plugin_filename: str):
    data_map = {
        "{% plugin_name %}": "None",
        "{% description %}": "None",
        "{% screenshots %}": "None",
        "{% ipp_configs %}": "None",
        "{% file_name %}": "None",
        "{% version %}": "None",
        "{% authors %}": "None",
    }
    plugin_configs = get_plugin_configs(plugin_filename)
    plugin_info = get_plugin_info(plugin_filename)

    data_map["{% plugin_name %}"] = plugin_info["name"]
    data_map["{% description %}"] = plugin_info["description"]
    data_map["{% file_name %}"] = pathlib.Path(plugin_filename).name
    data_map["{% version %}"] = plugin_info["version"]
    data_map["{% authors %}"] = plugin_info["authors"]

    if plugin_configs:
        configs_markdown = ""

        for config in plugin_configs:
            config_id = config.get("id", "None")
            config_type = config.get("type", "None")
            config_label = config.get("label", "None")
            config_default = config.get("default", "None")

            config_string = f" - {config_id}: {config_type}\n   - Label: {config_label}\n   - Default: {config_default}\n\n"
            configs_markdown += config_string

        data_map["{% ipp_configs %}"] = configs_markdown

    cwd = os.getcwd()

    with open(f"{cwd}/markdown_template.md", "r") as f:
        template = f.read()

    for key, value in data_map.items():
        template = template.replace(key, f"{value}")



    with open(f"{cwd}/markdown/{pathlib.Path(plugin_filename).name[:-3]}.md", "w", encoding="utf-8") as f:
        f.write(template)


def get_plugin_info(plugin_filename: str) -> dict:
    info_set = {
        "name": None,
        "version": None,
        "description": None,
        "authors": None,
    }
    cwd = os.getcwd()

    with open(cwd+plugin_filename, "r", encoding="utf-8") as js_file:
        for line in js_file:
            if "@name" in line and "@namespace" not in line:
                info_set["name"] = " ".join(line.split()[2:])
            elif "@version" in line:
                info_set["version"] = " ".join(line.split()[2:])
            elif "@description" in line:
                info_set["description"] = " ".join(line.split()[2:])
            elif "@author" in line:
                info_set["authors"] = " ".join(line.split()[2:])
    
    return info_set


def get_plugin_configs(plugin_name: str) -> list[dict]|None:
    """
    Specialized parser for pulling IP+ configs from js files.
    """
    cwd = os.getcwd()
    with open(cwd+plugin_name, "r", encoding="utf-8") as js_file:
        data = js_file.read().strip()
        
    try:
        constructor_index = data.index("constructor()")
    except ValueError:
        return
    
    first_brace = data.index("{", constructor_index)
    open_braces = 1
    close_braces = 0

    i = first_brace + 1
    while i < len(data) and open_braces > close_braces:
        character = data[i]
        if character == "{":
            open_braces += 1
        elif character == "}":
            close_braces += 1

        i += 1
        final_brace = i
        
    plugin_constructor = data[constructor_index:final_brace]
    
    try:
        config_index = plugin_constructor.index("config:")
    except ValueError:
        return

    start_list = plugin_constructor.index("[", config_index)
    open_sq_bracket = 1
    close_sq_bracket = 0

    i = start_list + 1
    while i < len(plugin_constructor) and open_sq_bracket > close_sq_bracket:
        character = plugin_constructor[i]
        if character == "[":
            open_sq_bracket += 1
        elif character == "]":
            close_sq_bracket += 1

        i += 1
        end_list = i
        
    config_string = plugin_constructor[start_list:end_list]
        
    jsonified_configs = config_string\
        .replace('type:', '"type":')\
        .replace('id:', '"id":')\
        .replace('label:', '"label":')\
        .replace('default:', '"default":')\
        .replace('max:', '"max":')\
        .replace('min:', '"min":')\
        .replace('step:', '"step:"')\
        .replace('options:[', '"options":[')
    
    while "`" in jsonified_configs:     # Escape backticked strings
        open_tick_index = jsonified_configs.index("`")
        close_tick_index = jsonified_configs.index("`", open_tick_index + 1) + 1
        tick_enclosed = jsonified_configs[open_tick_index:close_tick_index]
        new_enclosed = tick_enclosed.replace('"', r'\"')
        escaped = new_enclosed.replace("`", '"')
        
        jsonified_configs = jsonified_configs.replace(tick_enclosed, escaped)
            
    config_data = json.loads(jsonified_configs)
    
    return config_data
            
            
if __name__ == "__main__":
    generate_all_docs(replace_all=True)
    