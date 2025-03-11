from rest_framework import serializers


class NoteCreaterSerializer(serializers.Serializer):
    """ Registraion new user (allow any) """

    fNoteName = serializers.CharField()

    # class Meta:
    #     validators = [
    #         RegistrationValidator()
    #     ]