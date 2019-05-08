# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import User

class Company(models.Model):
    companyid = models.AutoField(primary_key=True)
    companyname = models.CharField(max_length=50, blank=True, null=True)
    description = models.CharField(max_length=500, blank=True, null=True)
    ownerid = models.ForeignKey('Usertable', models.DO_NOTHING, db_column='ownerid', blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'company'

    def __str__(self):
        return str(self.companyid)


class Cref(models.Model):
    cid = models.IntegerField(blank=True, null=True)
    iid = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'cref'

    def __str__(self):
        return str(self.cid)


class Position(models.Model):
    positionid = models.AutoField(primary_key=True)
    title = models.CharField(max_length=50, blank=True, null=True)
    description = models.CharField(max_length=500, blank=True, null=True)
    companyid = models.ForeignKey(Company, models.DO_NOTHING, db_column='companyid', blank=True, null=True)
    managerid = models.ForeignKey('Usertable', models.DO_NOTHING, db_column='managerid', blank=True, null=True)
    publicvisible = models.BooleanField(blank=True, null=True)
    isavailable = models.BooleanField(blank=True, null=True)
    startdate = models.DateField(blank=True, null=True)
    posteddate = models.DateField(blank=True, null=True)
    postingexpirationdate = models.DateField(blank=True, null=True)
    onboardinfo = models.TextField(blank=True, null=True)  # This field type is a guess.
    location = models.CharField(max_length=25, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'position'

    def __str__(self):
        return str(self.positionid)


class Pref(models.Model):
    pid = models.IntegerField(blank=True, null=True)
    iid = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'pref'

    def __str__(self):
        return str(self.pid)


class Uref(models.Model):
    uid = models.IntegerField(blank=True, null=True)
    iid = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'uref'

    def __str__(self):
        return str(self.uid)


class Usertable(models.Model):
    firstname = models.CharField(max_length=20, blank=True, null=True, default='')
    lastname = models.CharField(max_length=20, blank=True, null=True)
    userid = models.AutoField(primary_key=True)
    managerid = models.ForeignKey('self', models.DO_NOTHING, db_column='managerid', blank=True, null=True)
    positionid = models.ForeignKey(Position, models.DO_NOTHING, db_column='positionid', blank=True, null=True)
    companyid = models.ForeignKey(Company, models.DO_NOTHING, db_column='companyid', blank=True, null=True)
    hashiringpriv = models.BooleanField(blank=True, null=True)
    email = models.CharField(max_length=75, blank=True, null=True)
    joindate = models.DateField(blank=True, null=True)
    username = models.ForeignKey(User, on_delete=models.SET_NULL, null = True)

    class Meta:
        managed = True
        db_table = 'usertable'

    def __str__(self):
        return str(self.userid)


class Test(models.Model):
    firstname = models.CharField(max_length=20, blank=True, null=True)
    lastname = models.CharField(max_length=20, blank=True, null=True)
    hashiringpriv = models.BooleanField(blank=True, null=True)
    email = models.CharField(max_length=75, blank=True, null=True)
    joindate = models.DateField(blank=True, null=True)
    username = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        """String for representing the Model object."""
        return self.firstname