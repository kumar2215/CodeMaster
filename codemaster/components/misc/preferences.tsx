"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const codeThemes = [
  'a11y-dark',
  'a11y-dark.min',
  'a11y-light',
  'a11y-light.min',
  'agate',
  'agate.min',
  'an-old-hope',
  'an-old-hope.min',
  'androidstudio',
  'androidstudio.min',
  'arduino-light',
  'arduino-light.min',
  'arta',
  'arta.min',
  'ascetic',
  'ascetic.min',
  'atom-one-dark-reasonable',
  'atom-one-dark-reasonable.min',
  'atom-one-dark',
  'atom-one-dark.min',
  'atom-one-light',
  'atom-one-light.min',
  'brown-paper',
  'brown-paper.min',
  'codepen-embed',
  'codepen-embed.min',
  'color-brewer',
  'color-brewer.min',
  'dark',
  'dark.min',
  'default',
  'default.min',
  'devibeans',
  'devibeans.min',
  'docco',
  'docco.min',
  'far',
  'far.min',
  'felipec',
  'felipec.min',
  'foundation',
  'foundation.min',
  'github-dark-dimmed',
  'github-dark-dimmed.min',
  'github-dark',
  'github-dark.min',
  'github',
  'github.min',
  'gml',
  'gml.min',
  'googlecode',
  'googlecode.min',
  'gradient-dark',
  'gradient-dark.min',
  'gradient-light',
  'gradient-light.min',
  'grayscale',
  'grayscale.min',
  'hybrid',
  'hybrid.min',
  'idea',
  'idea.min',
  'intellij-light',
  'intellij-light.min',
  'ir-black',
  'ir-black.min',
  'isbl-editor-dark',
  'isbl-editor-dark.min',
  'isbl-editor-light',
  'isbl-editor-light.min',
  'kimbie-dark',
  'kimbie-dark.min',
  'kimbie-light',
  'kimbie-light.min',
  'lightfair',
  'lightfair.min',
  'lioshi',
  'lioshi.min',
  'magula',
  'magula.min',
  'mono-blue',
  'mono-blue.min',
  'monokai-sublime',
  'monokai-sublime.min',
  'monokai',
  'monokai.min',
  'night-owl',
  'night-owl.min',
  'nnfx-dark',
  'nnfx-dark.min',
  'nnfx-light',
  'nnfx-light.min',
  'nord',
  'nord.min',
  'obsidian',
  'obsidian.min',
  'panda-syntax-dark',
  'panda-syntax-dark.min',
  'panda-syntax-light',
  'panda-syntax-light.min',
  'paraiso-dark',
  'paraiso-dark.min',
  'paraiso-light',
  'paraiso-light.min',
  'pojoaque',
  'pojoaque.min',
  'purebasic',
  'purebasic.min',
  'qtcreator-dark',
  'qtcreator-dark.min',
  'qtcreator-light',
  'qtcreator-light.min',
  'rainbow',
  'rainbow.min',
  'routeros',
  'routeros.min',
  'school-book',
  'school-book.min',
  'shades-of-purple',
  'shades-of-purple.min',
  'srcery',
  'srcery.min',
  'stackoverflow-dark',
  'stackoverflow-dark.min',
  'stackoverflow-light',
  'stackoverflow-light.min',
  'sunburst',
  'sunburst.min',
  'tokyo-night-dark',
  'tokyo-night-dark.min',
  'tokyo-night-light',
  'tokyo-night-light.min',
  'tomorrow-night-blue',
  'tomorrow-night-blue.min',
  'tomorrow-night-bright',
  'tomorrow-night-bright.min',
  'vs',
  'vs.min',
  'vs2015',
  'vs2015.min',
  'xcode',
  'xcode.min',
  'xt256',
  'xt256.min'
];

export default function Preferences({ preferences, username }: {preferences: any, username: string}) {

  const supabase = createClient();
  const router = useRouter();
  const body = preferences?.body;
  const header = preferences?.header;

  const [bodyBackgroundColor, setBodyBackgroundColor] = useState(body?.backgroundColor);
  const [bodyTextColor, setBodyTextColor] = useState(body?.color);
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState(header?.backgroundColor);
  const [headerTextColor, setHeaderTextColor] = useState(header?.color);
  const [theme, setTheme] = useState(preferences?.codeColorTheme);

  function colorInputHandler(name: string, value: string, setter: any) {
    return (
      <div className="flex flex-row gap-2 mt-1">
        <label className="text-sm font-semibold lg:text-base">{`${name}:`}</label>
        <input
          type="color"
          value={value}
          onChange={(e) => {
            setter(e.target.value);
          }}
        />
      </div>
    );
  }

  const savePreferences = async () => {
    const { data, error } = await supabase
      .from('Users')
      .update({
        preferences: {
          body: {
            backgroundColor: bodyBackgroundColor,
            color: bodyTextColor
          },
          header: {
            backgroundColor: headerBackgroundColor,
            color: headerTextColor
          },
          codeColorTheme: theme
        }
      })
      .eq('username', username);

    if (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.", {autoClose: 3000});
      return;
    } else {
      toast.success("Preferences successfully updated!", {autoClose: 3000});
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full mb-2" style={{borderBottom: "1px solid black"}}>
        <h1 className="mb-2 text-lg font-bold lg:text-xl">Preferences</h1>
      </div>

      <div className="flex flex-col gap-6 mt-4"> 
        <div className="flex flex-row justify-between gap-2">
          <h1 className="text-sm font-semibold lg:text-lg">Body:</h1>
          {colorInputHandler("Background Color", bodyBackgroundColor, setBodyBackgroundColor)}
          {colorInputHandler("Text Color", bodyTextColor, setBodyTextColor)}
          <h1></h1>
        </div>

        <div className="flex flex-row justify-between gap-2">
          <h1 className="text-sm font-semibold lg:text-lg">Navbar:</h1>
          {colorInputHandler("Background Color", headerBackgroundColor, setHeaderBackgroundColor)}
          {colorInputHandler("Text Color", headerTextColor, setHeaderTextColor)}
          <h1></h1>
        </div>

        <div className="flex flex-row justify-between">
          <h1 className="text-sm font-semibold lg:text-lg">Code color theme:</h1>
          <select
            className='h-8 text-sm lg:text-lg w-fit input-info '
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            {codeThemes.map((theme) => (
              <option 
              key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
          <h1></h1>
          <h1></h1>
        </div>

        <button
          className="flex items-center justify-center h-10 p-2 font-medium text-white bg-blue-500 rounded-md w-fit lg:w-1/12 hover:bg-blue-700"
          onClick={savePreferences}
        >
          Save
        </button>
      </div>
      
    </div>
  );

}