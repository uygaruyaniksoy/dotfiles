# pylint: disable=C0111,R0903

"""Displays the current date and time.

Parameters:
    * datetime.format: strftime()-compatible formatting string
    * date.format    : alias for datetime.format
    * time.format    : alias for datetime.format
    * datetime.locale: locale to use rather than the system default
    * date.locale    : alias for datetime.locale
    * time.locale    : alias for datetime.locale
"""

from __future__ import absolute_import
import subprocess
import locale
import bumblebee.engine

class Module(bumblebee.engine.Module):
    def __init__(self, engine, config):
        super(Module, self).__init__(engine, config,
            bumblebee.output.Widget(full_text=self.next_entry))

    def next_entry(self, widget):
        p = subprocess.Popen("gcalcli agenda --tsv | head -1 | awk  '{out=\"\"; for(i=5;i<=NF;i++){out=out\" \"$i}; printf \"%s %s\", out, $1}'", stdout=subprocess.PIPE, shell=True)
        (output, err) = p.communicate()
        return output

# vim: tabstop=8 expandtab shiftwidth=4 softtabstop=4
